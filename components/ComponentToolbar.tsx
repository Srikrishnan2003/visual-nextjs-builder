"use client";
import { useState } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import AddConfirmDialog from "./dialogs/AddConfirmDialog";

const COMPONENTS = [
  { type: "Button", label: "Button", category: "Interactive" },
  { type: "Div", label: "Div Container", category: "Layout" },
  { type: "FlexBox", label: "Flex Container", category: "Layout" },
  { type: "Card", label: "Card", category: "Display" },
  { type: "Accordion", label: "Accordion", category: "Display" },
  { type: "Tabs", label: "Tabs", category: "Display" },
  { type: "Input", label: "Input Field", category: "Form" },
  { type: "Textarea", label: "Text Area", category: "Form" },
  { type: "Checkbox", label: "Checkbox", category: "Form" },
  { type: "Label", label: "Label", category: "Form" },
  { type: "Alert", label: "Alert", category: "Display" },
];

export default function ComponentToolbar() {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredComponents = COMPONENTS.filter(comp =>
    comp.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comp.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comp.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 h-full bg-slate-100/50 rounded-lg shadow-md overflow-y-auto">
      <h2 className="text-md font-bold mb-4 text-slate-900 tracking-wide border-b pb-2 border-slate-200">
        Components
      </h2>
      
      {/* Search Input */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input
          placeholder="Search components..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 text-sm"
        />
      </div>

      {filteredComponents.length === 0 ? (
        <p className="text-center text-slate-500 text-sm py-4">No components found</p>
      ) : (
        filteredComponents.map((comp) => {
          if (comp.type === "Alert") {
            return (
              <div key={comp.type} className="mt-4 pt-4 border-t border-slate-200">
                <button
                  disabled
                  className="w-full text-left px-3 py-2 text-sm bg-gray-200 rounded-lg shadow-sm mb-2 text-gray-500 cursor-not-allowed"
                >
                  {comp.label}
                </button>
                <p className="text-xs text-slate-500 px-3">
                  This is a static alert. Interactive alerts coming soon!
                </p>
              </div>
            );
          }
          return (
            <button
              key={comp.type}
              onClick={() => setSelectedComponent(comp.type)}
              className="w-full text-left px-3 py-2 text-sm bg-white rounded-lg shadow-sm mb-2 hover:bg-blue-50 hover:shadow-md text-slate-700 hover:text-blue-800 transition-all duration-200 transform hover:scale-105 border border-slate-100"
            >
              <div className="flex items-center justify-between">
                <span>{comp.label}</span>
                <span className="text-xs text-slate-400">{comp.category}</span>
              </div>
            </button>
          );
        })
      )}

      <AddConfirmDialog
        componentType={selectedComponent}
        onClose={() => setSelectedComponent(null)}
      />
    </div>
  );
}