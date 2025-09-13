"use client";

import { useFileSystemStore } from "@/stores/useFileSystemStore";
import { cn } from "@/lib/utils";
import { useState } from "react";
import CustomComponentConfirmDialog from "./dialogs/CustomComponentConfirmDialog";

export function CustomComponentPanel() {
  const { root } = useFileSystemStore();
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  const collectComponents = (node: typeof root): typeof root[] => {
    let components: typeof root[] = [];

    if (node.type === "file" && node.isCustomComponent) {
      components.push(node);
    }

    if (node.children) {
      for (const child of node.children) {
        components = [...components, ...collectComponents(child)];
      }
    }

    return components;
  };

  const customComponents = collectComponents(root);

  return (
    <div className="mt-4 px-4">
      <h4 className="text-lg text-slate-800 font-bold mb-3 border-b pb-2 border-slate-200 tracking-wide">Custom Components</h4>
      <div className="space-y-2 pt-2">
        {customComponents.map((comp) => (
          <button
            key={comp.id}
            onClick={() => setSelectedComponent(comp.name.replace(".tsx", ""))}
            className={cn("w-full text-left rounded-lg px-3 py-2 text-sm bg-white hover:bg-blue-50 text-slate-700 shadow-sm border border-slate-100 transition-all duration-200 transform hover:scale-[1.02]")}
          >
            {comp.name.replace(".tsx", "")}
          </button>
        ))}
      </div>

      {/* Dialog to choose which file to add the component to */}
      {selectedComponent && (
        <CustomComponentConfirmDialog
          componentType={selectedComponent}
          onClose={() => setSelectedComponent(null)}
        />
      )}
    </div>
  );
}
