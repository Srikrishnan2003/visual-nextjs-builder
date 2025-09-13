'use client';

import { useCanvasStore } from "@/stores/canvasStore";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ClassSelectorPopover } from "./ClassSelectorPopover";
import { ComponentNode } from "@/types/component-nodes";
import { propSchemas } from "@/lib/componentSchema";
import PropertyControl from "./PropertyControl";
import { Button } from "./ui/button"; // Import Button

export function PropertiesPanel() {
  const { selectedId, selectedComponent: getSelectedComponent, updateProps, startNesting } = useCanvasStore();

  const selectedComponent = getSelectedComponent();

  if (!selectedComponent) {
    return (
      <div className="p-3 border-l border-gray-100 h-full bg-gray-50 rounded-lg shadow-md">
        <p className="text-gray-500 text-sm">No component selected</p>
      </div>
    );
  }

  const isButton = selectedComponent.type === "Button";
  const isDiv = selectedComponent.type === "Div"; // Check if it's a Div
  const schema = (propSchemas[selectedComponent.type] || []);

  return (
    <div className="p-4 h-full space-y-4 bg-slate-100/50 rounded-lg shadow-md overflow-y-auto">
      <h2 className="font-bold text-xl text-slate-900 mb-4 tracking-wide border-b pb-2 border-slate-200">Properties</h2>

      {/* Nesting Button for Divs */}
      {isDiv && (
        <Button 
          onClick={() => startNesting(selectedComponent.id)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          Nest a Component
        </Button>
      )}

      {schema.map((field) => (
        <PropertyControl
          key={field.key}
          field={field}
          value={selectedComponent.props[field.key]}
          componentId={selectedComponent.id}
          updateProps={updateProps}
        />
      ))}
    </div>
  );
}

