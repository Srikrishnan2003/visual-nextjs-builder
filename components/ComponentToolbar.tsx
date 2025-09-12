"use client";
import { useState } from "react";
import AddConfirmDialog from "./dialogs/AddConfirmDialog";

const COMPONENTS = [
  { type: "Button", label: "Button" },
  { type: "Div", label: "Div Container" },
  { type: "FlexBox", label: "Flex Container" },
];

export default function ComponentToolbar() {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  return (
    <div className="p-2 border-r h-full bg-muted">
      <h2 className="text-xs font-semibold mb-2">Components</h2>
      {COMPONENTS.map((comp) => (
        <button
          key={comp.type}
          onClick={() => setSelectedComponent(comp.type)}
          className="w-full text-left px-2 py-1 text-sm bg-white rounded shadow mb-2 hover:bg-gray-100"
        >
          {comp.label}
        </button>
      ))}

      <AddConfirmDialog
        componentType={selectedComponent}
        onClose={() => setSelectedComponent(null)}
      />
    </div>
  );
}
