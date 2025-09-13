import { create } from "zustand";
import { v4 as uuid } from "uuid";
import { ComponentNode } from "@/types/component-nodes";
import { useFileSystemStore } from "./useFileSystemStore";

interface CanvasState {
  canvasTree: ComponentNode[];
  selectedId: string | null;
  addComponent: (type: string, parentId?: string) => void;
  addComponentToParent: (type: string, parentId: string) => void;
  moveComponent: (id: string, x: number, y: number) => void;
  selectComponent: (id: string) => void;
  updateProps: (id: string, newProps: Record<string, any>) => void;
  setCanvasTree: (tree: ComponentNode[]) => void;
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

export const useCanvasStore = create<CanvasState>((set, get) => ({
  canvasTree: [],
  selectedId: null,

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

    set({ canvasTree: updatedTree });
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
    set({ canvasTree: updatedTree });
  },
        
  moveComponent: (id: string, x: number, y: number) => {
    const { updateFileCanvasTree, selectedFileId } = useFileSystemStore.getState();
    const updatedTree = updateComponentPosition(get().canvasTree, id, x, y); // Use the recursive helper

    updateFileCanvasTree(selectedFileId!, updatedTree);
    set({ canvasTree: updatedTree });
  },
        

  selectComponent: (id) => set(() => ({ selectedId: id })),

  updateProps: (id, newProps) => {
    const { updateFileCanvasTree, selectedFileId } = useFileSystemStore.getState();
    const updatedTree = get().canvasTree.map((node) =>
      node.id === id ? { ...node, props: { ...node.props, ...newProps } } : node
    );

    updateFileCanvasTree(selectedFileId!, updatedTree);
    set({ canvasTree: updatedTree });
  },
      
  setCanvasTree: (tree) => {
    const { selectedFileId, updateFileCanvasTree } = useFileSystemStore.getState();
    if (selectedFileId) {
      updateFileCanvasTree(selectedFileId, tree);
    }

    set({ canvasTree: tree });
  },
}));