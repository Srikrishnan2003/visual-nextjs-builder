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
    <div className="mt-4 px-2">
      <h4 className="text-sm text-gray-700 font-bold mb-2">Custom Components</h4>
      <div className="space-y-1">
        {customComponents.map((comp) => (
          <button
            key={comp.id}
            onClick={() => setSelectedComponent(comp.name.replace(".tsx", ""))}
            className={cn("w-full text-left rounded-md px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 shadow-sm")}
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
