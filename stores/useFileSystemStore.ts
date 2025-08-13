import { ComponentNode } from './../types/component-nodes';
import { create } from "zustand";
import { v4 as uuid } from "uuid";


export type FileNode = {
    id: string;
    name: string;
    type: "file" | "folder";
    content?: string;
    canvasTree?: ComponentNode[];
    children?: FileNode[];
    isCustomComponent?: boolean;
};

interface FileSystemState {
    root: FileNode;
    selectedFileId: string | null;

    selectFile: (id: string) => void;
    updateFileContent: (id: string, content: string) => void;
    updateFileCanvasTree: (id: string, tree: ComponentNode[]) => void;

    addFile: (parentId: string, name: string) => void;
    addFolder: (parentId: string, name: string) => void;
    deleteNode: (id: string) => void;
    renameNode: (id: string, newName: string) => void;
    markAsCustomComponent: (id: string, value: boolean) => void;

    getSelectedFile: () => FileNode | null;
    getFileById: (id: string) => FileNode | null;
}

export const useFileSystemStore = create<FileSystemState>((set, get) => ({
    root: {
        id: "root",
        name: "project-root",
        type: "folder",
        children: [
            {
                id: uuid(),
                name: "index.tsx",
                type: "file",
                content: "",
                canvasTree: [],
            },
            {
                id: uuid(),
                name: "components",
                type: "folder",
                children: [],
            },
        ],
    },
    selectedFileId: null,

    selectFile: (id) => set({ selectedFileId: id }),

    updateFileContent: (id, content) => 
        set((state) => {
            const updateContent = (node: FileNode): FileNode => {
                if (node.id === id) return { ...node, content };
                if (node.children)
                    return { ...node, children: node.children.map(updateContent) };
                return node;
            };
            return { root: updateContent(state.root) };
        }),

        updateFileCanvasTree: (id, tree) =>
            set((state) => {
                const updateTree = (node: FileNode): FileNode => {
                    if (node.id === id) return { ...node, canvasTree: tree };
                    if (node.children)
                        return { ...node, children: node.children.map(updateTree) };
                    return node;
                };
                return { root: updateTree(state.root) };
            }),
        
        addFile: (parentId, name) =>
            set((state) => {
                const addToFolder = (node: FileNode): FileNode => {
                    if (node.id === parentId && node.type === "folder") {
                        const newFile: FileNode = {
                            id: uuid(),
                            name,
                            type: "file",
                            content: "",
                            canvasTree: [],
                        };
                        return { ...node, children: [...(node.children || []), newFile] };
                    }
                    if (node.children)
                        return { ...node, children: node.children.map(addToFolder) };
                    return node;
                };
                return { root: addToFolder(state.root) };
            }),

        addFolder: (parentId, name) =>
            set((state) => {
                const addToFolder = (node: FileNode): FileNode => {
                    if(node.id === parentId && node.type === "folder") {
                        const newFolder: FileNode = {
                            id: uuid(),
                            name, 
                            type: "folder",
                            children: [],
                        };
                        return { ...node, children: [...(node.children || []), newFolder] };
                    }
                    if (node.children)
                        return { ...node, children: node.children.map(addToFolder) };
                    return node;
                };
                return { root: addToFolder(state.root) };
            }),

        deleteNode: (id) =>
            set((state) => {
                const deleteRecursive = (node: FileNode): FileNode | null => {
                    if (node.id === id) return null;
                    if (node.children)
                        return {
                            ...node,
                            children: node.children
                                .map(deleteRecursive)
                                .filter(Boolean) as FileNode[],
                        };
                    return node;
                };
                return { root: deleteRecursive(state.root)! };
            }),

        renameNode: (id, newName) =>
            set((state) => {
                const rename = (node: FileNode): FileNode => {
                    if (node.id == id) return { ...node, name: newName };
                    if (node.children)
                        return { ...node, children: node.children.map(rename) };
                    return node;
                };
                return { root: rename(state.root) };
            }),

        markAsCustomComponent: (id: string, value: boolean) => 
            set((state) => {
                const mark = (node: FileNode): FileNode => {
                    if (node.id === id) return { ...node, isCustomComponent: value };
                    if (node.children)
                        return { ...node, children: node.children.map(mark) };
                    return node;
                };
                return { root: mark(state.root) };
            }),

        getSelectedFile: () => {
            const find = (node: FileNode): FileNode | null => {
                if (node.id === get().selectedFileId) return node;

                if (node.children) {
                    for (const child of node.children) {
                        const found = find(child);
                        if (found) return found;
                    }
                }
                return null;
            };
            return find(get().root);
        },

    getFileById: (id) => {
        let result: FileNode | null = null;

        const search = (node: FileNode): void => {
            if (node.id === id) {
                result = node;
                return;
            }
            if (node.children) {
                node.children.forEach(search);
            }
        };

        search(get().root);
        return result;
    }

}))