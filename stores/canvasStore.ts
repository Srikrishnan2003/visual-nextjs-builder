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
    history: [[]], // Start with an initial empty state
    historyIndex: 0,

    setViewport: (viewport) => set({ viewport }),

    addComponent: (type, parentId) => {
      const { updateFileCanvasTree, selectedFileId } = useFileSystemStore.getState();
      const newComponent: ComponentNode = {
        id: uuid(),
        type,
        props: { children: type },
        x: 50,
        y: 50,
      };

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
          
    selectComponent: (id) => set(() => ({ selectedId: id })),

    updateProps: (id, newProps) => {
      const { updateFileCanvasTree, selectedFileId } = useFileSystemStore.getState();
      const updatedTree = get().canvasTree.map((node) =>
        node.id === id ? { ...node, props: { ...node.props, ...newProps } } : node
      );

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

    // Correct implementation of selectedComponent as a method
    selectedComponent: () => {
      const { canvasTree, selectedId } = get();
      return selectedId ? findNodeById(canvasTree, selectedId) : null;
    },
  };
});