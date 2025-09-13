"use client";

import { useFileSystemStore, FileNode } from "@/stores/useFileSystemStore";
import { useState } from "react";
import { ChevronDown, ChevronRight, File, FileText, Folder, MoreVertical, Pencil, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { useCanvasStore } from "@/stores/canvasStore";

export function FileExplorer() {
    const {
        root,
        selectFile,
        selectedFileId,
        addFile,
        addFolder,
        deleteNode,
        renameNode,
        markAsCustomComponent
    } = useFileSystemStore();

    return (
        <div className="text-sm px-3 pt-3 text-slate-800">
            <FileNodeItem node={root} />
        </div>
    );

    function FileNodeItem({ node }: { node: FileNode }) {
        const [expanded, setExpanded] = useState(true);
        const [renaming, setRenaming] = useState(false);
        const [tempName, setTempName] = useState(node.name);

        const isFolder = node.type === "folder";
        const isSelected = node.id === selectedFileId;

        const handleRename = () => {
            renameNode(node.id, tempName);
            setRenaming(false);
        };
        
        const canvasStore = useCanvasStore();

        return (
            <div className="ml-2 min-w-0">
                <div
                    className={cn(
                        "flex items-center justify-between gap-1 rounded-lg px-2 py-1.5 hover:bg-slate-100 cursor-pointer transition-colors duration-150",
                        isSelected && "bg-blue-100 text-blue-800 font-semibold"
                    )}
                    onClick={(e) => {
                        if (renaming) {
                            e.stopPropagation();
                            return;
                        }
                        if (!isFolder) {
                            selectFile(node.id);

                            const file = useFileSystemStore.getState().getFileById(node.id);
                            if (file) {
                                canvasStore.setCanvasTree(file.canvasTree || []);
                            }
                        }
                    }}
                >
                    <div className="flex items-center gap-1" onClick={() => isFolder && setExpanded((prev) => !prev)}>
                        {isFolder ? (
                            expanded ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />
                        ) : (
                            <FileText className="w-4 h-4 text-slate-500" />
                        )}
                        {renaming ? (
                            <Input
                                autoFocus
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                onFocus={(e) => e.target.select()}
                                onBlur={handleRename}
                                onClick={(e) => e.stopPropagation()}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleRename();
                                }}
                                className="h-7 text-sm px-2 py-1 border border-slate-200 rounded-md"
                            />
                        ) : (
                            <span className="truncate text-sm min-w-0">{node.name}</span>
                        )}
                    </div>

                    {node.id !== "root" && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="w-7 h-7 text-slate-500 hover:bg-slate-200/50">
                                    <MoreVertical className="w-3 h-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="right" className="bg-white/90 backdrop-blur-sm border border-slate-100 rounded-lg shadow-lg p-1">
                                {isFolder && (
                                    <>
                                        <DropdownMenuItem onClick={() => addFile(node.id, "newFile.tsx")} className="px-3 py-2 text-sm hover:bg-slate-50 rounded-md whitespace-normal break-words text-slate-700">
                                            <File className="mr-2 h-4 w-4" /> New File
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => addFolder(node.id, "newFolder")} className="px-3 py-2 text-sm hover:bg-slate-50 rounded-md whitespace-normal break-words text-slate-700">
                                            <Folder className="mr-2 h-4 w-4" /> New Folder
                                        </DropdownMenuItem>
                                    </>
                                )}
                                <DropdownMenuItem 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setRenaming(true);
                                    }} className="px-3 py-2 text-sm hover:bg-slate-50 rounded-md whitespace-normal break-words text-slate-700">
                                   <Pencil className="mr-2 h-4 w-4" /> Rename
                                </DropdownMenuItem>
                                {!isFolder && 
                                    <DropdownMenuItem
                                        onClick={() => markAsCustomComponent(node.id, !node.isCustomComponent)}
                                        className="px-3 py-2 text-sm hover:bg-slate-50 rounded-md whitespace-normal break-words text-slate-700"
                                    >
                                        <File className="mr-2 h-4 w-4" />
                                        {node.isCustomComponent ? "Unmark as Component" : "Mark as Component"}
                                    </DropdownMenuItem>
                                }
                                
                                <DropdownMenuItem onClick={() => deleteNode(node.id)} className="px-3 py-2 text-sm hover:bg-red-50 rounded-md whitespace-normal break-words text-red-600">
                                    <Trash className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                {expanded && isFolder && (
                    <div className="ml-2 border-l border-slate-200 pl-3 space-y-2">
                        {node.children?.map((child) => (
                            <FileNodeItem key={child.id} node={child} />
                        ))}
                    </div>
                )}
            </div>
        );
    }
}