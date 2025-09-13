'use client';
import { useCanvasStore } from "@/stores/canvasStore";
import React from "react";
import { ComponentWrapper } from "./ComponentWrapper";
import { cn } from "@/lib/utils";

export default function Canvas() {
  const { canvasTree, viewport } = useCanvasStore();

  const viewportWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  };

  return (
    <div
      className="relative flex-1 h-full p-4 rounded-2xl shadow-lg overflow-auto bg-slate-50 flex justify-center"
    >
      {/* Dot Pattern */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.05) 1px, transparent 0)',
          backgroundSize: '15px 15px',
        }}
      />
      
      {/* The actual canvas frame that resizes */}
      <div 
        className={cn(
          "relative bg-white shadow-lg transition-all duration-300 ease-in-out",
          // If desktop, it takes full width and height. Otherwise, it has a border and is inset.
          viewport === 'desktop' ? 'w-full h-full' : 'w-full border-2 border-slate-200 my-4 rounded-lg'
        )}
        style={{ maxWidth: viewportWidths[viewport] }}
      >
        {canvasTree.map((node) => (
          <ComponentWrapper key={node.id} node={node} />
        ))}
      </div>
    </div>
  );
}
