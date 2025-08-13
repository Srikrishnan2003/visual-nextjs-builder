"use client";

import { useCanvasStore } from "@/stores/canvasStore";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useState } from "react";
import { ClassSelectorPopover } from "./ClassSelectorPopover";

export function PropertiesPanel() {
    const { canvasTree, selectedId, updateProps } = useCanvasStore();
    const [open, setOpen] = useState(false);

    const selectedComponent = canvasTree.find((c) => c.id ===  selectedId);

    if(!selectedComponent) {
        return (
            <div className="p-4 border-l h-full">
                <p className="text-muted-foreground">No component selected</p>
            </div>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateProps(selectedComponent.id, {
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="p-4 border-l h-full space-y-4">
            <h2 className="font-bold text-lg">Properties</h2>

            {/* Text editing */}
            <div className="space-y-2">
                <Label htmlFor="children">Text</Label>
                <Input
                    id="children"
                    name="children"
                    value={typeof selectedComponent.props.children === "string" ? selectedComponent.props.children : ""}
                    onChange={handleChange}
                />
            </div>

            {/* Tailwind Class editing with dialog */}
            <div className="space-y-2">
                <Label htmlFor="className">Tailwind Class</Label>
                <ClassSelectorPopover
                    selectedClasses={selectedComponent.props.className || ""}
                    onUpdate={(newClassName) =>
                        updateProps(selectedComponent.id, { className: newClassName })
                    }
                />      
            </div>
        </div>
    );
}