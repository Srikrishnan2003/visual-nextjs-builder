"use client";
import { useCanvasStore } from "@/stores/canvasStore";
import { componentRegistry } from "@/lib/componentRegistry";
import React from "react";
import { ComponentWrapper } from "./ComponentWrapper";

export default function Canvas() {
  const { canvasTree } = useCanvasStore();

  return (
    <div
      className="relative flex-1 h-full p-4 rounded-2xl shadow-xl overflow-auto bg-slate-50"
    >
      {/* Dot Pattern */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.05) 1px, transparent 0)',
          backgroundSize: '15px 15px',
        }}
      />
      {canvasTree.map((node) => (
        <ComponentWrapper key={node.id} node={node} />
      ))}
    </div>
  );
}
