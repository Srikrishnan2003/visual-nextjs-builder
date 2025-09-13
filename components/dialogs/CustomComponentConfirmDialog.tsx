"use client";

import { useFileSystemStore } from "@/stores/useFileSystemStore";
import { useCanvasStore } from "@/stores/canvasStore";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { useEffect, useState } from "react";

interface CustomComponentConfirmDialogProps {
    componentType: string | null;
    onClose: () => void;
}

export default function CustomComponentConfirmDialog({ componentType, onClose }: CustomComponentConfirmDialogProps) {
    const [open ,setOpen] = useState(true);
    const { root, updateFileCanvasTree } = useFileSystemStore();
    const { addComponent } = useCanvasStore();

    const [pageFiles, setPageFiles] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
        const collect = (node: typeof root) : { id: string; name: string }[] => {
            let pages: { id: string; name: string }[] = [];

            if (
                node.type === 'file' && 
                node.name.endsWith(".tsx") &&
                !node.isCustomComponent
            ) {
                pages.push({ id: node.id, name: node.name });
            }

            if (node.children) {
                for (const child of node.children) {
                    pages = [...pages, ...collect(child)];
                }
            }

            return pages;
        };

        setPageFiles(collect(root));
    }, [root]);

    const handleInsert = (fileId: string) => {
        const newComponent = {
            id: crypto.randomUUID(),
            type: componentType!,
            props: { children: componentType },
            x: 50,
            y: 50,
        };

        const file = useFileSystemStore.getState().getFileById(fileId);
        if (!file) return;

        const updatedTree = [...(file.canvasTree || []), newComponent];
        updateFileCanvasTree(fileId, updatedTree);

        setOpen(false);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={() => { setOpen(false); onClose(); }}>
            <DialogTitle>Custom Component</DialogTitle>
            <DialogContent className="space-y-6">
                <h2 className="font-bold text-base text-gray-900">
                    Add &quot;{componentType}&quot; to which page?
                </h2>
                <div className="space-y-3">
                    {pageFiles.map((file) => (
                        <button
                            key={file.id}
                            onClick={() => handleInsert(file.id)}
                            className="w-full px-4 py-2.5 text-left bg-gray-50 hover:bg-gray-100 rounded-lg shadow-md text-gray-800"
                        >   
                            {file.name}
                        </button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}