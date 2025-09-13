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
        <div className="text-xs px-2 pt-2 text-gray-700">
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
            <div className="ml-2">
                <div
                    className={cn(
                        "flex items-center justify-between gap-1 rounded-md px-2 py-1 hover:bg-gray-100 cursor-pointer",
                        isSelected && "bg-blue-100 text-blue-800"
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
                            expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />
                        ) : (
                            <FileText className="w-3 h-3" />
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
                                className="h-5 text-xs px-1.5 py-0.5 border border-gray-300"
                            />
                        ) : (
                            <span className="truncate text-sm">{node.name}</span>
                        )}
                    </div>

                    {node.id !== "root" && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="w-5 h-5">
                                    <MoreVertical className="w-3 h-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="right">
                                {isFolder && (
                                    <>
                                        <DropdownMenuItem onClick={() => addFile(node.id, "newFile.tsx")}>
                                            <File /> New File
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => addFolder(node.id, "newFolder")}>
                                            <Folder /> New Folder
                                        </DropdownMenuItem>
                                    </>
                                )}
                                <DropdownMenuItem 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setRenaming(true);
                                    }}>
                                   <Pencil /> Rename
                                </DropdownMenuItem>
                                {!isFolder && 
                                    <DropdownMenuItem
                                        onClick={() => markAsCustomComponent(node.id, !node.isCustomComponent)}
                                    >
                                        <File />
                                        {node.isCustomComponent ? "Unmark as Component" : "Mark as Component"}
                                    </DropdownMenuItem>
                                }
                                
                                <DropdownMenuItem onClick={() => deleteNode(node.id)}>
                                    <Trash /> Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                {expanded && isFolder && (
                    <div className="ml-2 border-l border-gray-200 pl-2 space-y-1">
                        {node.children?.map((child) => (
                            <FileNodeItem key={child.id} node={child} />
                        ))}
                    </div>
                )}
            </div>
        );
    }
}