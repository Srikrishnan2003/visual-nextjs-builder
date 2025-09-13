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
    <div className="p-4 h-full bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-sm font-bold mb-2 text-gray-700">Components</h2>
      {COMPONENTS.map((comp) => (
        <button
          key={comp.type}
          onClick={() => setSelectedComponent(comp.type)}
          className="w-full text-left px-3 py-2 text-sm bg-blue-50 rounded-md shadow-sm mb-2 hover:bg-blue-100 text-blue-800"
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

