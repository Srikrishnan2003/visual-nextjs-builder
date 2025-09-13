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
    <div className="p-5 h-full bg-white rounded-xl shadow-lg">
      <h2 className="text-sm font-bold mb-3 text-gray-800">Components</h2>
      {COMPONENTS.map((comp) => (
        <button
          key={comp.type}
          onClick={() => setSelectedComponent(comp.type)}
          className="w-full text-left px-3 py-2 text-sm bg-blue-100 rounded-lg shadow-md mb-3 hover:bg-blue-200 text-blue-900"
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

