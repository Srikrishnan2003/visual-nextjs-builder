"use client";

import { useCanvasStore } from "@/stores/canvasStore";
import { ComponentNode } from "@/types/component-nodes";
import { ChevronDown, ChevronRight, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function ComponentTreeView() {
  const { canvasTree, selectComponent, selectedId } = useCanvasStore();

  if (canvasTree.length === 0) {
    return (
      <div className="p-4 text-center text-slate-500 text-sm">
        No components on canvas
      </div>
    );
  }

  return (
    <div className="p-3 space-y-1 overflow-y-auto h-full">
      <h3 className="font-semibold text-sm text-slate-700 mb-2">Component Tree</h3>
      {canvasTree.map((node) => (
        <TreeNode key={node.id} node={node} level={0} />
      ))}
    </div>
  );
}

function TreeNode({ node, level }: { node: ComponentNode; level: number }) {
  const { selectComponent, selectedId } = useCanvasStore();
  const [collapsed, setCollapsed] = useState(false);
  
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedId === node.id;

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-1 px-2 py-1.5 rounded-md cursor-pointer hover:bg-slate-100 transition-colors",
          isSelected && "bg-blue-100 text-blue-800 font-semibold"
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => selectComponent(node.id)}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCollapsed(!collapsed);
            }}
            className="hover:bg-slate-200 rounded p-0.5"
          >
            {collapsed ? (
              <ChevronRight className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
        ) : (
          <span className="w-4" />
        )}
        
        <span className="text-xs truncate flex-1">
          {node.type}
          {node.props.children && typeof node.props.children === 'string' && (
            <span className="text-slate-400 ml-1">
              "{node.props.children.slice(0, 15)}..."
            </span>
          )}
        </span>
      </div>

      {hasChildren && !collapsed && (
        <div>
          {node.children!.map((child) => (
            <TreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}