"use client";
import { useCanvasStore } from "@/stores/canvasStore";
import { componentRegistry } from "@/lib/componentRegistry";
import React from "react";
import { ComponentWrapper } from "./ComponentWrapper";

export default function Canvas() {
  const { canvasTree } = useCanvasStore();

  return (
    <div
      className="relative flex-1 h-full p-4 rounded-2xl shadow-2xl overflow-auto bg-gradient-to-br from-gray-100 to-gray-50"
    >
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />
      {canvasTree.map((node) => (
        <ComponentWrapper key={node.id} node={node} />
      ))}
    </div>
  );
}
