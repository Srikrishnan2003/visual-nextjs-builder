import { create } from "zustand";
import { v4 as uuid } from "uuid";
import { ComponentNode } from "@/types/component-nodes";
import { useFileSystemStore } from "./useFileSystemStore";

export type Viewport = "desktop" | "tablet" | "mobile";

interface CanvasState {
  canvasTree: ComponentNode[];
  selectedId: string | null;
  selectedComponent: () => ComponentNode | null; // Corrected derived property as a method
  viewport: Viewport;
  nestingMode: boolean; // New: true when selecting a component to nest
  nestingTargetId: string | null; // New: ID of the Div to nest into
  history: ComponentNode[][];
  historyIndex: number;
  addComponent: (type: string, parentId?: string) => void;
  addComponentToParent: (type: string, parentId: string) => void;
  moveComponent: (id: string, x: number, y: number) => void;
  selectComponent: (id: string) => void;
  updateProps: (id: string, newProps: Record<string, any>) => void;
  setCanvasTree: (tree: ComponentNode[]) => void;
  setViewport: (viewport: Viewport) => void;
  undo: () => void;
  redo: () => void;
  startNesting: (targetDivId: string) => void; // New: Initiates nesting mode
  cancelNesting: () => void; // New: Cancels nesting mode
  performNesting: (componentToNestId: string) => void; // New: Performs the actual nesting
  addAccordionItem: (accordionId: string) => void; // New: Adds an AccordionItem to an Accordion
}

// Helper function to find a node by its ID in the tree (moved from PropertiesPanel)
function findNodeById(nodes: ComponentNode[], id: string): ComponentNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

// Helper to remove a node from the tree
function removeNodeById(nodes: ComponentNode[], idToRemove: string): ComponentNode[] {
  return nodes.filter(node => node.id !== idToRemove).map(node => ({
    ...node,
    children: node.children ? removeNodeById(node.children, idToRemove) : node.children,
  }));
}

// Helper to add a node to a specific parent
function addNodeToParent(nodes: ComponentNode[], parentId: string, nodeToAdd: ComponentNode): ComponentNode[] {
  return nodes.map(node => {
    if (node.id === parentId) {
      return {
        ...node,
        children: [...(node.children || []), nodeToAdd],
      };
    }
    return {
      ...node,
      children: node.children ? addNodeToParent(node.children, parentId, nodeToAdd) : node.children,
    };
  });
}

function insertComponent(
  tree: ComponentNode[],
  parentId: string | null,
  newNode: ComponentNode
): ComponentNode[] {
  if (!parentId) {
    return [...tree, newNode];
  }

  return tree.map((node) => {
    if (node.id === parentId) {
      const children = node.children ?? [];
      return {
        ...node,
        children: [...children, newNode],
      };
    } else if (node.children) {
      return {
        ...node,
        children: insertComponent(node.children, parentId, newNode),
      };
    }
    return node;
  })
}

function updateComponentPosition(
  nodes: ComponentNode[],
  idToUpdate: string,
  newX: number,
  newY: number
): ComponentNode[] {
  return nodes.map((node) => {
    if (node.id === idToUpdate) {
      return { ...node, x: newX, y: newY };
    }
    if (node.children) {
      return {
        ...node,
        children: updateComponentPosition(node.children, idToUpdate, newX, newY),
      };
    }
    return node;
  });
}

// Helper to recursively update props of a node by ID
function updateNodePropsById(
  nodes: ComponentNode[],
  idToUpdate: string,
  newProps: Record<string, any>
): ComponentNode[] {
  return nodes.map((node) => {
    if (node.id === idToUpdate) {
      // Check if any of the newProps are actually different from the current props
      const hasChanged = Object.keys(newProps).some(key => node.props[key] !== newProps[key]);

      if (hasChanged) {
        return { ...node, props: { ...node.props, ...newProps } };
      }
      return node; // Return the original node if no props have changed
    }
    if (node.children) {
      return {
        ...node,
        children: updateNodePropsById(node.children, idToUpdate, newProps),
      };
    }
    return node;
  });
}

export const useCanvasStore = create<CanvasState>((set, get) => {
  // This helper function wraps our state updates to manage the history.
  const setWithHistory = (newTree: ComponentNode[]) => {
    const { history, historyIndex } = get();
    // Cut off the future part of history if we are undoing and then make a new change.
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newTree);

    set({
      canvasTree: newTree,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  };

  return {
    canvasTree: [],
    selectedId: null,
    viewport: "desktop",
    nestingMode: false,
    nestingTargetId: null,
    history: [[]], // Start with an initial empty state
    historyIndex: 0,

    setViewport: (viewport) => set({ viewport }),

    // Correct implementation of selectedComponent as a method
    selectedComponent: () => {
      const { canvasTree, selectedId } = get();
      return selectedId ? findNodeById(canvasTree, selectedId) : null;
    },

    startNesting: (targetDivId) => set({ nestingMode: true, nestingTargetId: targetDivId, selectedId: null }),
    cancelNesting: () => set({ nestingMode: false, nestingTargetId: null }),

    performNesting: (componentToNestId) => {
      const { canvasTree, nestingTargetId, selectedFileId } = get();
      if (!nestingTargetId) return; // Should not happen if nestingMode is true

      // 1. Find the component to nest
      const componentToNest = findNodeById(canvasTree, componentToNestId);
      if (!componentToNest) return; // Component not found

      // 2. Remove it from its current position
      const treeAfterRemoval = removeNodeById(canvasTree, componentToNestId);

      // 3. Add it as a child to the target Div
      const treeAfterNesting = addNodeToParent(treeAfterRemoval, nestingTargetId, { ...componentToNest, parentId: nestingTargetId, x: 0, y: 0 });

      // 4. Update store and history
      const { updateFileCanvasTree } = useFileSystemStore.getState();
      updateFileCanvasTree(selectedFileId!, treeAfterNesting);
      setWithHistory(treeAfterNesting);

      // 5. Reset nesting mode and select the new parent
      set({ nestingMode: false, nestingTargetId: null, selectedId: nestingTargetId });
    },

    addComponent: (type, parentId) => {
      const { updateFileCanvasTree, selectedFileId } = useFileSystemStore.getState();
      let newComponent: ComponentNode = {
        id: uuid(),
        type,
        props: { children: type },
        x: 50,
        y: 50,
      };

      if (type === "Accordion") {
        const accordionItemId = uuid();
        const accordionTriggerId = uuid();
        const accordionContentId = uuid();
        const headingTextId = uuid();
        const contentTextId = uuid();

        newComponent = {
          ...newComponent,
          children: [
            {
              id: accordionItemId,
              type: "AccordionItem",
              props: { value: `item-${uuid().slice(0, 4)}` },
              x: 0,
              y: 0,
              parentId: newComponent.id,
              children: [
                {
                  id: accordionTriggerId,
                  type: "AccordionTrigger",
                  props: {},
                  x: 0, y: 0,
                  parentId: accordionItemId,
                  children: [
                    {
                      id: headingTextId,
                      type: "P",
                      props: { children: "Accordion Heading" },
                      x: 0, y: 0,
                      parentId: accordionTriggerId,
                    },
                  ],
                },
                {
                  id: accordionContentId,
                  type: "AccordionContent",
                  props: {},
                  x: 0, y: 0,
                  parentId: accordionItemId,
                  children: [
                    {
                      id: contentTextId,
                      type: "P",
                      props: { children: "Accordion Content" },
                      x: 0, y: 0,
                      parentId: accordionContentId,
                    },
                  ],
                },
              ],
            },
          ],
        };
      }

      const updatedTree = parentId
        ? insertComponent(get().canvasTree, parentId, newComponent)
        : [...get().canvasTree, newComponent];

      updateFileCanvasTree(selectedFileId!, updatedTree);
      setWithHistory(updatedTree);
    },

    addComponentToParent: (type: string, parentId: string) => {
      const { updateFileCanvasTree, selectedFileId } = useFileSystemStore.getState();
      const newNode: ComponentNode = {
        id: uuid(),
        type,
        props: { children: type },
        x: 0,
        y: 0,
        parentId,
      };

      const updateChildren = (nodes: ComponentNode[]): ComponentNode[] => {
        return nodes.map((node) => {
          if (node.id === parentId) {
            return {
              ...node,
              children: [...(node.children || []), newNode],
            };
          }
          return {
            ...node, 
            children: node.children ? updateChildren(node.children) : [],
          };
        });
      };

      const updatedTree = updateChildren(get().canvasTree);
      updateFileCanvasTree(selectedFileId!, updatedTree);
      setWithHistory(updatedTree);
    },
          
    moveComponent: (id: string, x: number, y: number) => {
      const { updateFileCanvasTree, selectedFileId } = useFileSystemStore.getState();
      const updatedTree = updateComponentPosition(get().canvasTree, id, x, y);

      updateFileCanvasTree(selectedFileId!, updatedTree);
      setWithHistory(updatedTree);
    },
          
    selectComponent: (id) => {
      const { canvasTree } = get();
      const selectedNode = findNodeById(canvasTree, id);

      if (selectedNode && selectedNode.type === "AccordionItem") {
        // Find the AccordionTrigger child within the selected AccordionItem
        const accordionTriggerChild = selectedNode.children?.find(
          (child) => child.type === "AccordionTrigger"
        );

        if (accordionTriggerChild) {
          set(() => ({ selectedId: accordionTriggerChild.id }));
          return; // Exit to prevent setting selectedId to AccordionItem
        }
      }
      // For all other components, or if AccordionItem has no Trigger, select the original ID
      set(() => ({ selectedId: id }));
    },

    updateProps: (id, newProps) => {
      const { updateFileCanvasTree, selectedFileId } = useFileSystemStore.getState();
      const updatedTree = updateNodePropsById(get().canvasTree, id, newProps);

      updateFileCanvasTree(selectedFileId!, updatedTree);
      setWithHistory(updatedTree);
    },
        
    setCanvasTree: (tree) => {
      const { selectedFileId, updateFileCanvasTree } = useFileSystemStore.getState();
      if (selectedFileId) {
        updateFileCanvasTree(selectedFileId, tree);
      }
      // When loading a tree, reset the history.
      set({
        canvasTree: tree,
        history: [tree],
        historyIndex: 0,
      });
    },

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
            x: 0, y: 0,
            parentId: newAccordionItemId,
            children: [
              {
                id: newHeadingTextId,
                type: "P",
                props: { children: "New Accordion Heading" },
                x: 0, y: 0,
                parentId: newAccordionTriggerId,
              },
            ],
          },
          {
            id: newAccordionContentId,
            type: "AccordionContent",
            props: {},
            x: 0, y: 0,
            parentId: newAccordionItemId,
            children: [
              {
                id: newContentTextId,
                type: "P",
                props: { children: "New Accordion Content" },
                x: 0, y: 0,
                parentId: newAccordionContentId,
              },
            ],
          },
        ],
      };

      const updatedTree = addNodeToParent(get().canvasTree, accordionId, newAccordionItem);

      updateFileCanvasTree(selectedFileId!, updatedTree);
      setWithHistory(updatedTree);
    },

    // Correct implementation of selectedComponent as a method
    selectedComponent: () => {
      const { canvasTree, selectedId } = get();
      return selectedId ? findNodeById(canvasTree, selectedId) : null;
    },
  };
});