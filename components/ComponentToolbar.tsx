"use client";
import { useState } from "react";
import AddConfirmDialog from "./dialogs/AddConfirmDialog";

const COMPONENTS = [
  { type: "Button", label: "Button" },
  { type: "Div", label: "Div Container" },
  { type: "FlexBox", label: "Flex Container" },
  { type: "Card", label: "Card" },
  { type: "Accordion", label: "Accordion" },
  { type: "Tabs", label: "Tabs" },
  { type: "Alert", label: "Alert" },
  { type: "Input", label: "Input Field" },
  { type: "Textarea", label: "Text Area" },
  { type: "Checkbox", label: "Checkbox" },
];

export default function ComponentToolbar() {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  return (
    <div className="p-4 h-full bg-slate-100/50 rounded-lg shadow-md overflow-y-auto">
      <h2 className="text-md font-bold mb-4 text-slate-900 tracking-wide border-b pb-2 border-slate-200">Components</h2>
      {COMPONENTS.map((comp) => (
        <button
          key={comp.type}
          onClick={() => setSelectedComponent(comp.type)}
          className="w-full text-left px-3 py-2 text-sm bg-white rounded-lg shadow-sm mb-2 hover:bg-blue-50 hover:shadow-md text-slate-700 hover:text-blue-800 transition-all duration-200 transform hover:scale-105 border border-slate-100"
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

