// stores/canvasStore.ts
import { create } from "zustand";
import { v4 as uuid } from "uuid";
import { ComponentNode } from "@/types/component-nodes";
import { useFileSystemStore } from "./useFileSystemStore";
import {
  findNodeById,
  removeNodeById,
  addNodeToParent,
  insertComponent,
  updateComponentPosition,
  updateNodePropsById,
  createComplexComponentNode,
} from "./store/canvasStore.helpers";
import {
  copyComponent as copyComponentHelper,
  pasteComponent as pasteComponentHelper,
  duplicateComponent as duplicateComponentHelper,
} from "./store/canvasStore.clipboard";
import { debounce, pruneHistory, perfMonitor, throttle } from "@/lib/performace";

export type Viewport = "desktop" | "tablet" | "mobile";

interface CanvasState {
  // State
  canvasTree: ComponentNode[];
  selectedId: string | null;
  viewport: Viewport;
  nestingMode: boolean;
  nestingTargetId: string | null;
  history: ComponentNode[][];
  historyIndex: number;
  expandedParentId: string | null;
  clipboard: ComponentNode | null;
  selectedTabItemIds: { triggerId: string | null; contentId: string | null };

  // Getters
  selectedComponent: () => ComponentNode | null;

  // Basic Actions
  setViewport: (viewport: Viewport) => void;
  selectComponent: (id: string) => void;
  setCanvasTree: (tree: ComponentNode[]) => void;

  // Component Management
  addComponent: (type: string, parentId?: string) => void;
  addComponentToParent: (type: string, parentId: string) => void;
  moveComponent: (id: string, x: number, y: number) => void;
  updateProps: (id: string, newProps: Record<string, any>) => void;
  removeComponent: (id: string) => void;

  // Clipboard Actions
  copyComponent: (id: string) => void;
  pasteComponent: () => void;
  duplicateComponent: (id: string) => void;

  // History Actions
  undo: () => void;
  redo: () => void;

  // Nesting Actions
  startNesting: (targetDivId: string) => void;
  cancelNesting: () => void;
  performNesting: (componentToNestId: string) => void;

  // Complex Component Actions
  addAccordionItem: (accordionId: string) => void;
  addTabItem: (tabsId: string) => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => {
  // Helper function to manage history
   const setWithHistory = (newTree: ComponentNode[]) => {
    perfMonitor.start('setWithHistory');
    
    const { history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newTree);

    // OPTIMIZATION: Limit history to prevent memory issues
    const prunedHistory = pruneHistory(newHistory, 50); // Keep last 50 states

    set({
      canvasTree: newTree,
      history: prunedHistory,
      historyIndex: prunedHistory.length - 1,
    });
    
    perfMonitor.end('setWithHistory');
  };

  // ===== DEBOUNCED AUTO-SAVE =====
  const debouncedAutoSave = debounce((tree: ComponentNode[], fileId: string) => {
    const { updateFileCanvasTree } = useFileSystemStore.getState();
    updateFileCanvasTree(fileId, tree);
  }, 500); // Save after 500ms of inactivity

   // ===== OPTIMIZED UPDATE PROPS =====
  const optimizedUpdateProps = (id: string, newProps: Record<string, any>) => {
    perfMonitor.start('updateProps');
    
    const { canvasTree } = get();
    const { selectedFileId } = useFileSystemStore.getState();
    
    const updatedTree = updateNodePropsById(canvasTree, id, newProps);
    
    // Only update if tree actually changed
    if (updatedTree !== canvasTree) {
      if (selectedFileId) {
        debouncedAutoSave(updatedTree, selectedFileId); // Debounced
      }
      setWithHistory(updatedTree);
    }
    
    perfMonitor.end('updateProps');
  };
  
   // ===== THROTTLED MOVE COMPONENT =====
  const throttledMoveComponent = throttle((id: string, x: number, y: number) => {
    const { canvasTree } = get();
    const { selectedFileId } = useFileSystemStore.getState();
    const updatedTree = updateComponentPosition(canvasTree, id, x, y);

    if (selectedFileId) {
      debouncedAutoSave(updatedTree, selectedFileId);
    }
    setWithHistory(updatedTree);
  }, 16); // ~60fps

  return {
    // ===== Initial State =====
    canvasTree: [],
    selectedId: null,
    viewport: "desktop",
    nestingMode: false,
    nestingTargetId: null,
    history: [[]],
    historyIndex: 0,
    expandedParentId: null,
    clipboard: null,
    selectedTabItemIds: { triggerId: null, contentId: null },

    // ===== Getters =====
    selectedComponent: () => {
      const { canvasTree, selectedId } = get();
      return selectedId ? findNodeById(canvasTree, selectedId) : null;
    },

    // ===== Basic Actions =====
    setViewport: (viewport) => set({ viewport }),

    setCanvasTree: (tree) => {
      const { selectedFileId, updateFileCanvasTree } = useFileSystemStore.getState();
      if (selectedFileId) {
        updateFileCanvasTree(selectedFileId, tree);
      }
      set({
        canvasTree: tree,
        history: [tree],
        historyIndex: 0,
      });
    },

    // ===== Component Management =====
    addComponent: (type, parentId) => {
      const { updateFileCanvasTree, selectedFileId } = useFileSystemStore.getState();
      const newComponent = createComplexComponentNode(type, parentId);
      newComponent.x = 50;
      newComponent.y = 50;

      const updatedTree = parentId
        ? insertComponent(get().canvasTree, parentId, newComponent)
        : [...get().canvasTree, newComponent];

      if (selectedFileId) {
        updateFileCanvasTree(selectedFileId, updatedTree);
      }
      setWithHistory(updatedTree);
    },

    addComponentToParent: (type: string, parentId: string) => {
      const { updateFileCanvasTree, selectedFileId } = useFileSystemStore.getState();
      const newNode = createComplexComponentNode(type, parentId);
      const updatedTree = addNodeToParent(get().canvasTree, parentId, newNode);

      if (selectedFileId) {
        updateFileCanvasTree(selectedFileId, updatedTree);
      }
      setWithHistory(updatedTree);
    },

    moveComponent: (id: string, x: number, y: number) => {
      const { canvasTree } = get();
      const { selectedFileId } = useFileSystemStore.getState();
      const updatedTree = updateComponentPosition(canvasTree, id, x, y);

      if (selectedFileId) {
        useFileSystemStore.getState().updateFileCanvasTree(selectedFileId, updatedTree);
      }
      setWithHistory(updatedTree);
    },

    updateProps: optimizedUpdateProps,

    removeComponent: (idToRemove: string) => {
      const { canvasTree, selectedId } = get();
      const { updateFileCanvasTree, selectedFileId } = useFileSystemStore.getState();
      const updatedTree = removeNodeById(canvasTree, idToRemove);

      if (selectedFileId) {
        updateFileCanvasTree(selectedFileId, updatedTree);
      }
      setWithHistory(updatedTree);

      if (selectedId === idToRemove) {
        set({ selectedId: null, expandedParentId: null });
      }
    },

    // ===== Clipboard Actions =====
    copyComponent: (id: string) => {
      const { canvasTree } = get();
      const clipboard = copyComponentHelper(id, canvasTree);
      if (clipboard) {
        set({ clipboard });
      }
    },

    pasteComponent: () => {
      const { clipboard, canvasTree } = get();
      const { selectedFileId } = useFileSystemStore.getState();
      const result = pasteComponentHelper(clipboard, canvasTree, selectedFileId, setWithHistory);
      
      if (result) {
        set({ selectedId: result.newComponentId });
      }
    },

    duplicateComponent: (id: string) => {
      const { canvasTree } = get();
      const { selectedFileId } = useFileSystemStore.getState();
      const newComponentId = duplicateComponentHelper(id, canvasTree, selectedFileId, setWithHistory);
      
      if (newComponentId) {
        set({ selectedId: newComponentId });
      }
    },

    // ===== History Actions =====
    undo: () => {
      const { history, historyIndex } = get();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        set({
          canvasTree: history[newIndex],
          historyIndex: newIndex,
        });
      }
    },

    redo: () => {
      const { history, historyIndex } = get();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        set({
          canvasTree: history[newIndex],
          historyIndex: newIndex,
        });
      }
    },

    // ===== Nesting Actions =====
    startNesting: (targetDivId) =>
      set({ nestingMode: true, nestingTargetId: targetDivId, selectedId: null }),

    cancelNesting: () => set({ nestingMode: false, nestingTargetId: null }),

    performNesting: (componentToNestId) => {
      const { canvasTree, nestingTargetId } = get();
      const { updateFileCanvasTree, selectedFileId } = useFileSystemStore.getState();
      
      if (!nestingTargetId) return;

      const componentToNest = findNodeById(canvasTree, componentToNestId);
      if (!componentToNest) return;

      const treeAfterRemoval = removeNodeById(canvasTree, componentToNestId);
      const treeAfterNesting = addNodeToParent(
        treeAfterRemoval,
        nestingTargetId,
        { ...componentToNest, parentId: nestingTargetId, x: 0, y: 0 }
      );

      if (selectedFileId) {
        updateFileCanvasTree(selectedFileId, treeAfterNesting);
      }
      setWithHistory(treeAfterNesting);
      set({ nestingMode: false, nestingTargetId: null, selectedId: nestingTargetId });
    },

    // ===== Selection Logic =====
    selectComponent: (id) => {
      const { canvasTree, selectedId } = get();
      const selectedNode = findNodeById(canvasTree, id);

      let newSelectedId = id;
      let newExpandedParentId = null;
      let newSelectedTabItemIds = { triggerId: null, contentId: null };

      if (selectedNode) {
        const parentNode = selectedNode.parentId
          ? findNodeById(canvasTree, selectedNode.parentId)
          : null;

        // TabsContent parent selection logic
        if (parentNode && parentNode.type === "TabsContent" && parentNode.id !== selectedId) {
          newSelectedId = parentNode.id;
        }
        // AccordionItem selection logic
        else if (selectedNode.type === "AccordionItem") {
          const accordionTriggerChild = selectedNode.children?.find(
            (child) => child.type === "AccordionTrigger"
          );
          if (accordionTriggerChild) {
            newSelectedId = accordionTriggerChild.id;
            newExpandedParentId = accordionTriggerChild.id;
          }
        }
        // TabsTrigger selection logic
        else if (selectedNode.type === "TabsTrigger") {
          if (selectedNode.parentId) {
            newSelectedId = selectedNode.parentId;
          }
          const tabValue = selectedNode.props.value;
          if (tabValue) {
            const tabsList = findNodeById(canvasTree, selectedNode.parentId!);
            if (tabsList && tabsList.parentId) {
              const tabsComponent = findNodeById(canvasTree, tabsList.parentId);
              if (tabsComponent && tabsComponent.children) {
                const trigger = tabsList?.children?.find(
                  (child) => child.type === "TabsTrigger" && child.props.value === tabValue
                );
                const content = tabsComponent.children.find(
                  (child) => child.type === "TabsContent" && child.props.value === tabValue
                );
                if (trigger) newSelectedTabItemIds.triggerId = trigger.id;
                if (content) newSelectedTabItemIds.contentId = content.id;
              }
            }
          }
        }
        // TabsContent selection logic
        else if (selectedNode.type === "TabsContent") {
          if (selectedNode.parentId) {
            newSelectedId = selectedNode.parentId;
          }
          const tabValue = selectedNode.props.value;
          if (tabValue) {
            const tabsComponent = findNodeById(canvasTree, selectedNode.parentId!);
            if (tabsComponent && tabsComponent.children) {
              const tabsList = tabsComponent.children.find(
                (child) => child.type === "TabsList"
              );
              const trigger = tabsList?.children?.find(
                (child) => child.type === "TabsTrigger" && child.props.value === tabValue
              );
              const content = tabsComponent.children.find(
                (child) => child.type === "TabsContent" && child.props.value === tabValue
              );
              if (trigger) newSelectedTabItemIds.triggerId = trigger.id;
              if (content) newSelectedTabItemIds.contentId = content.id;
            }
          }
          newExpandedParentId =
            selectedNode.children && selectedNode.children.length > 0
              ? selectedNode.id
              : null;
        }
        // Default selection logic
        else {
          newExpandedParentId =
            selectedNode.children && selectedNode.children.length > 0
              ? selectedNode.id
              : null;
        }
      }

      set({
        selectedId: newSelectedId,
        expandedParentId: newExpandedParentId,
        selectedTabItemIds: newSelectedTabItemIds,
      });
    },

    // ===== Complex Component Actions =====
    addAccordionItem: (accordionId) => {
      const { updateFileCanvasTree, selectedFileId } = useFileSystemStore.getState();
      const newAccordionItemId = uuid();
      const newAccordionTriggerId = uuid();
      const newAccordionContentId = uuid();
      const newHeadingTextId = uuid();
      const newContentTextId = uuid();

      const newAccordionItem: ComponentNode = {
        id: newAccordionItemId,
        type: "AccordionItem",
        props: { value: `item-${uuid().slice(0, 4)}` },
        x: 0,
        y: 0,
        parentId: accordionId,
        children: [
          {
            id: newAccordionTriggerId,
            type: "AccordionTrigger",
            props: {},
            x: 0,
            y: 0,
            parentId: newAccordionItemId,
            children: [
              {
                id: newHeadingTextId,
                type: "P",
                props: { children: "New Accordion Heading" },
                x: 0,
                y: 0,
                parentId: newAccordionTriggerId,
              },
            ],
          },
          {
            id: newAccordionContentId,
            type: "AccordionContent",
            props: {},
            x: 0,
            y: 0,
            parentId: newAccordionItemId,
            children: [
              {
                id: newContentTextId,
                type: "P",
                props: { children: "New Accordion Content" },
                x: 0,
                y: 0,
                parentId: newAccordionContentId,
              },
            ],
          },
        ],
      };

      const updatedTree = addNodeToParent(get().canvasTree, accordionId, newAccordionItem);

      if (selectedFileId) {
        updateFileCanvasTree(selectedFileId, updatedTree);
      }
      setWithHistory(updatedTree);
    },

    addTabItem: (tabsId: string) => {
      const { updateFileCanvasTree, selectedFileId } = useFileSystemStore.getState();
      const newTabValue = `tab${uuid().slice(0, 4)}`;
      const newTabTriggerId = uuid();
      const newTabContentId = uuid();
      const newTabContentPId = uuid();

      const newTabTrigger: ComponentNode = {
        id: newTabTriggerId,
        type: "TabsTrigger",
        props: { value: newTabValue, children: `Tab ${uuid().slice(0, 4)}` },
        x: 0,
        y: 0,
        parentId: tabsId,
      };

      const newTabContent: ComponentNode = {
        id: newTabContentId,
        type: "TabsContent",
        props: { value: newTabValue },
        x: 0,
        y: 0,
        parentId: tabsId,
        children: [
          {
            id: newTabContentPId,
            type: "P",
            props: { children: `Content for ${newTabValue}` },
            x: 0,
            y: 0,
            parentId: newTabContentId,
          },
        ],
      };

      let updatedTree = get().canvasTree;

      // Find TabsList and add trigger
      updatedTree = updatedTree.map((node) => {
        if (node.id === tabsId && node.children) {
          return {
            ...node,
            children: node.children.map((child) => {
              if (child.type === "TabsList") {
                return {
                  ...child,
                  children: [
                    ...(child.children || []),
                    { ...newTabTrigger, parentId: child.id },
                  ],
                };
              }
              return child;
            }),
          };
        }
        return node;
      });

      // Add TabsContent to Tabs
      updatedTree = addNodeToParent(updatedTree, tabsId, newTabContent);

      if (selectedFileId) {
        updateFileCanvasTree(selectedFileId, updatedTree);
      }
      setWithHistory(updatedTree);
    },
  };
});