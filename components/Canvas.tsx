"use client";
import { useCanvasStore } from "@/stores/canvasStore";
import { componentRegistry } from "@/lib/componentRegistry";
import React from "react";
import { ComponentWrapper } from "./ComponentWrapper";

export default function Canvas() {
  const { canvasTree } = useCanvasStore();

  return (
    <div
      className="relative flex-1 h-full p-4 rounded-xl shadow-xl overflow-auto bg-gradient-to-br from-gray-50 to-white"
    >
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px'
        }}
      />
      {canvasTree.map((node) => (
        <ComponentWrapper key={node.id} node={node} />
      ))}
    </div>
  );
}
