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
            <DialogContent className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-100 p-6 space-y-6">
                <DialogTitle className="text-2xl font-bold text-slate-800">Custom Component</DialogTitle>
                <h2 className="font-bold text-lg text-slate-800">
                    Add &quot;<span className="text-blue-600">{componentType}</span>&quot; to which page?
                </h2>
                <div className="space-y-3">
                    {pageFiles.map((file) => (
                        <button
                            key={file.id}
                            onClick={() => handleInsert(file.id)}
                            className="w-full px-4 py-3 text-left bg-white hover:bg-blue-50 rounded-lg shadow-sm border border-slate-100 text-slate-700 transition-all duration-200 transform hover:scale-[1.02]"
                        >   
                            {file.name}
                        </button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}