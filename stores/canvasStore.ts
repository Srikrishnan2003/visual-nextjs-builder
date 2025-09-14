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
  expandedParentId: string | null; // New: ID of the parent whose children are currently expanded/highlighted
  selectedTabItemIds: { triggerId: string | null, contentId: string | null }; // New: Stores the IDs of the selected tab item pair
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
  removeComponent: (id: string) => void; // New: Removes a component from the canvas
  addTabItem: (tabsId: string) => void; // New: Adds a TabsTrigger and TabsContent pair to a Tabs component
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

// Helper to create complex component nodes with default children
function createComplexComponentNode(type: string, parentId?: string): ComponentNode {
  let newComponent: ComponentNode = {
    id: uuid(),
    type,
    props: { children: type },
    x: 0,
    y: 0,
    parentId,
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
  } else if (type === "Card") {
    const cardId = newComponent.id;
    const cardHeaderId = uuid();
    const cardTitleId = uuid();
    const cardDescriptionId = uuid();
    const cardContentId = uuid();
    const cardFooterId = uuid();

    newComponent = {
      ...newComponent,
      props: { className: "w-full max-w-sm" },
      children: [
        {
          id: cardHeaderId,
          type: "CardHeader",
          props: {},
          x: 0, y: 0, parentId: cardId,
          children: [
            {
              id: cardTitleId,
              type: "CardTitle",
              props: { children: "Card Title" },
              x: 0, y: 0, parentId: cardHeaderId,
            },
            {
              id: cardDescriptionId,
              type: "CardDescription",
              props: { children: "Card Description" },
              x: 0, y: 0, parentId: cardHeaderId,
            },
          ],
        },
        {
          id: cardContentId,
          type: "CardContent",
          props: {},
          x: 0, y: 0, parentId: cardId,
          children: [
            {
              id: uuid(),
              type: "P",
              props: { children: "Card Content" },
              x: 0, y: 0, parentId: cardContentId,
            },
          ],
        },
        {
          id: cardFooterId,
          type: "CardFooter",
          props: {},
          x: 0, y: 0, parentId: cardId,
          children: [
            {
              id: uuid(),
              type: "P",
              props: { children: "Card Footer" },
              x: 0, y: 0, parentId: cardFooterId,
            },
          ],
        },
      ],
    };
  } else if (type === "Tabs") {
    const tabsId = newComponent.id;
    const tabsListId = uuid();
    const tabTrigger1Id = uuid();
    const tabTrigger2Id = uuid();
    const tabsContent1Id = uuid();
    const tabsContent2Id = uuid();
    const tabContentP1Id = uuid();
    const tabContentP2Id = uuid();

    newComponent = {
      ...newComponent,
      props: { defaultValue: "tab1" },
      children: [
        {
          id: tabsListId,
          type: "TabsList",
          props: { className: "flex flex-wrap" }, // Explicitly set flex and wrap
          x: 0, y: 0, parentId: tabsId,
          children: [
            {
              id: tabTrigger1Id,
              type: "TabsTrigger",
              props: { value: "tab1", children: "Tab 1" },
              x: 0, y: 0, parentId: tabsListId,
            },
            {
              id: tabTrigger2Id,
              type: "TabsTrigger",
              props: { value: "tab2", children: "Tab 2" },
              x: 0, y: 0, parentId: tabsListId,
            },
          ],
        },
        {
          id: tabsContent1Id,
          type: "TabsContent",
          props: { value: "tab1" },
          x: 0, y: 0, parentId: tabsId,
          children: [
            {
              id: tabContentP1Id,
              type: "P",
              props: { children: "Content for Tab 1" },
              x: 0, y: 0, parentId: tabsContent1Id,
            },
          ],
        },
        {
          id: tabsContent2Id,
          type: "TabsContent",
          props: { value: "tab2" },
          x: 0, y: 0, parentId: tabsId,
          children: [
            {
              id: tabContentP2Id,
              type: "P",
              props: { children: "Content for Tab 2" },
              x: 0, y: 0, parentId: tabsContent2Id,
            },
          ],
        },
      ],
    };
  }
  return newComponent;
}

// Helper to recursively update props of a node by ID
function updateNodePropsById(
  nodes: ComponentNode[],
  idToUpdate: string,
  newProps: Record<string, any>
): ComponentNode[] {
  let treeHasChanged = false;

  const newNodes = nodes.map((node) => {
    if (node.id === idToUpdate) {
      const hasChanged = Object.keys(newProps).some(
        (key) => node.props[key] !== newProps[key]
      );
      if (hasChanged) {
        treeHasChanged = true;
        return { ...node, props: { ...node.props, ...newProps } };
      }
      return node;
    }
    if (node.children) {
      const newChildren = updateNodePropsById(
        node.children,
        idToUpdate,
        newProps
      );
      if (newChildren !== node.children) {
        treeHasChanged = true;
        return { ...node, children: newChildren };
      }
      return node;
    }
    return node;
  });

  return treeHasChanged ? newNodes : nodes;
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
    expandedParentId: null, // Initialize new state variable
    selectedTabItemIds: { triggerId: null, contentId: null }, // Initialize new state variable

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
      const newComponent = createComplexComponentNode(type, parentId);
      newComponent.x = 50;
      newComponent.y = 50;

      const updatedTree = parentId
        ? insertComponent(get().canvasTree, parentId, newComponent)
        : [...get().canvasTree, newComponent];

      updateFileCanvasTree(selectedFileId!, updatedTree);
      setWithHistory(updatedTree);
    },

    addComponentToParent: (type: string, parentId: string) => {
      const { updateFileCanvasTree, selectedFileId } = useFileSystemStore.getState();
      const newNode = createComplexComponentNode(type, parentId);
      const updatedTree = addNodeToParent(get().canvasTree, parentId, newNode);

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
      const { canvasTree, selectedId } = get(); // Get selectedId
      const selectedNode = findNodeById(canvasTree, id);

      let newSelectedId = id;
      let newExpandedParentId = null;
      let newSelectedTabItemIds = { triggerId: null, contentId: null };

      if (selectedNode) {
        const parentNode = selectedNode.parentId
          ? findNodeById(canvasTree, selectedNode.parentId)
          : null

        // If clicking a child of a TabsContent, and the TabsContent is NOT already selected, select the TabsContent.
        if (parentNode && parentNode.type === "TabsContent" && parentNode.id !== selectedId) {
          newSelectedId = parentNode.id
        } else if (selectedNode.type === "AccordionItem") {
          const accordionTriggerChild = selectedNode.children?.find(
            (child) => child.type === "AccordionTrigger"
          )
          if (accordionTriggerChild) {
            newSelectedId = accordionTriggerChild.id
            newExpandedParentId = accordionTriggerChild.id
          }
        } else if (selectedNode.type === "TabsTrigger") {
          if (selectedNode.parentId) {
            newSelectedId = selectedNode.parentId; // Selects TabsList
          }
          const tabValue = selectedNode.props.value;
          if (tabValue) {
            const tabsList = findNodeById(canvasTree, selectedNode.parentId!)
            if (tabsList && tabsList.parentId) {
              const tabsComponent = findNodeById(canvasTree, tabsList.parentId)

              if (tabsComponent && tabsComponent.children) {
                const trigger = tabsList?.children?.find(
                  (child) =>
                    child.type === "TabsTrigger" &&
                    child.props.value === tabValue
                )
                const content = tabsComponent.children.find(
                  (child) =>
                    child.type === "TabsContent" &&
                    child.props.value === tabValue
                )

                if (trigger) newSelectedTabItemIds.triggerId = trigger.id
                if (content) newSelectedTabItemIds.contentId = content.id
              }
            }
          }
        } else if (selectedNode.type === "TabsContent") {
          if (selectedNode.parentId) {
            newSelectedId = selectedNode.parentId; // Selects Tabs
          }
          const tabValue = selectedNode.props.value;
          if (tabValue) {
            const tabsComponent = findNodeById(canvasTree, selectedNode.parentId!)
            if (tabsComponent && tabsComponent.children) {
              const tabsList = tabsComponent.children.find(
                (child) => child.type === "TabsList"
              )
              const trigger = tabsList?.children?.find(
                (child) =>
                  child.type === "TabsTrigger" &&
                  child.props.value === tabValue
              )
              const content = tabsComponent.children.find(
                (child) =>
                  child.type === "TabsContent" &&
                  child.props.value === tabValue
              )

              if (trigger) newSelectedTabItemIds.triggerId = trigger.id
              if (content) newSelectedTabItemIds.contentId = content.id
            }
          }
          newExpandedParentId =
            selectedNode.children && selectedNode.children.length > 0
              ? selectedNode.id
              : null
        } else {
          newExpandedParentId =
            selectedNode.children && selectedNode.children.length > 0
              ? selectedNode.id
              : null;
        }
      }

      set(() => ({
        selectedId: newSelectedId,
        expandedParentId: newExpandedParentId,
        selectedTabItemIds: newSelectedTabItemIds,
      }));
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

    addTabItem: (tabsId: string) => {
      const { updateFileCanvasTree, selectedFileId } = useFileSystemStore.getState();
      const newTabValue = `tab${uuid().slice(0, 4)}`;
      const newTabTriggerId = uuid();
      const newTabContentId = uuid();
      const newTabContentPId = uuid();

      console.log("addTabItem called for tabsId:", tabsId);

      const newTabTrigger: ComponentNode = {
        id: newTabTriggerId,
        type: "TabsTrigger",
        props: { value: newTabValue, children: `Tab ${uuid().slice(0, 4)}` },
        x: 0, y: 0,
        parentId: tabsId, // This will be re-parented to TabsList later
      };

      const newTabContent: ComponentNode = {
        id: newTabContentId,
        type: "TabsContent",
        props: { value: newTabValue },
        x: 0, y: 0,
        parentId: tabsId,
        children: [
          {
            id: newTabContentPId,
            type: "P",
            props: { children: `Content for ${newTabValue}` },
            x: 0, y: 0,
            parentId: newTabContentId,
          },
        ],
      };

      let updatedTree = get().canvasTree;
      console.log("Initial canvasTree:", JSON.stringify(updatedTree, null, 2));

      // Find the TabsList and add the new TabsTrigger to it
      updatedTree = updatedTree.map(node => {
        if (node.id === tabsId && node.children) {
          console.log("Found Tabs component:", node.id);
          return {
            ...node,
            children: node.children.map(child => {
              if (child.type === "TabsList") {
                console.log("Found TabsList component:", child.id);
                return {
                  ...child,
                  children: [...(child.children || []), { ...newTabTrigger, parentId: child.id }],
                };
              }
              return child;
            }),
          };
        }
        return node;
      });
      console.log("canvasTree after adding trigger:", JSON.stringify(updatedTree, null, 2));

      // Add the new TabsContent directly to the Tabs component
      updatedTree = addNodeToParent(updatedTree, tabsId, newTabContent);
      console.log("canvasTree after adding content:", JSON.stringify(updatedTree, null, 2));

      updateFileCanvasTree(selectedFileId!, updatedTree);
      setWithHistory(updatedTree);
    },

    removeComponent: (idToRemove: string) => {
      const { canvasTree, selectedId, selectedFileId } = get();
      const updatedTree = removeNodeById(canvasTree, idToRemove);

      const { updateFileCanvasTree } = useFileSystemStore.getState();
      updateFileCanvasTree(selectedFileId!, updatedTree);
      setWithHistory(updatedTree);

      // If the removed component was selected, clear selection
      if (selectedId === idToRemove) {
        set({ selectedId: null, expandedParentId: null });
      }
    },
  };
});