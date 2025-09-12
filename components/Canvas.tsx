"use client";
import { useCanvasStore } from "@/stores/canvasStore";
import { componentRegistry } from "@/lib/componentRegistry";
import React from "react";
import { ComponentWrapper } from "./ComponentWrapper";

export default function Canvas() {
  const { canvasTree, moveComponent } = useCanvasStore();

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      const id = e.dataTransfer.getData("componentId");
      const canvas = e.currentTarget.getBoundingClientRect();

      const x = e.clientX - canvas.left;
      const y = e.clientY - canvas.top;

      moveComponent(id, x, y);
    };

    const allowDrop = (e: React.DragEvent) => {
      e.preventDefault();
    }

  return (
    <div
      className="relative flex-1 h-full p-4 border rounded-lg shadow-inner overflow-auto"
      onDrop={handleDrop}
      onDragOver={allowDrop}
    >
      {canvasTree.map((node) => (
        <ComponentWrapper key={node.id} node={node} />
      ))}
    </div>
  );
}
