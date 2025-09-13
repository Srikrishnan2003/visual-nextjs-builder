"use client";

import { useCanvasStore } from "@/stores/canvasStore";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch"; // add a switch for boolean fields
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"; // for dropdown
import { ClassSelectorPopover } from "./ClassSelectorPopover";
import { ComponentNode } from "@/types/component-nodes";
import { propSchemas } from "@/lib/componentSchema";
import { useCallback } from "react";

export function PropertiesPanel() {
  const { canvasTree, selectedId, updateProps } = useCanvasStore();

  const findNodeById = useCallback((nodes: ComponentNode[], id: string): ComponentNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }, []);

  const selectedComponent = selectedId ? findNodeById(canvasTree, selectedId) : null;

  if (!selectedComponent) {
    return (
      <div className="p-6 border-l border-gray-300 h-full bg-gray-100 rounded-xl shadow-lg">
        <p className="text-gray-600">No component selected</p>
      </div>
    );
  }

  const schema = propSchemas[selectedComponent.type] || [];

  return (
    <div className="p-6 border-l border-gray-300 h-full space-y-4 bg-white rounded-xl shadow-lg">
      <h2 className="font-bold text-xl text-gray-800 mb-4">Properties</h2>

      {schema.map((field) => {
        const value = selectedComponent.props[field.key] || "";

        switch (field.type) {
          case "string":
            return (
              <div key={field.key} className="space-y-3">
                <Label htmlFor={field.key} className="font-medium text-gray-700 mb-1">{field.label}</Label>
                <Input
                  id={field.key}
                  name={field.key}
                  value={value}
                  onChange={(e) => updateProps(selectedComponent.id, { [field.key]: e.target.value })}
                  className="rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            );

          case "boolean":
            return (
              <div key={field.key} className="flex items-center justify-between space-y-3">
                <Label htmlFor={field.key} className="font-medium text-gray-700 mb-1">{field.label}</Label>
                <Switch
                  id={field.key}
                  checked={!!value}
                  onCheckedChange={(checked) => updateProps(selectedComponent.id, { [field.key]: checked })}
                />
              </div>
            );

          case "select":
            return (
              <div key={field.key} className="space-y-3">
                <Label className="font-medium text-gray-700 mb-1">{field.label}</Label>
                <Select
                  value={value}
                  onValueChange={(newVal) => updateProps(selectedComponent.id, { [field.key]: newVal })}
                >
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                    <SelectValue placeholder={`Select ${field.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );

          case "className":
            return (
              <div key={field.key} className="space-y-3">
                <Label className="font-medium text-gray-700 mb-1">{field.label}</Label>
                <ClassSelectorPopover
                  selectedClasses={value}
                  onUpdate={(newClassName) => updateProps(selectedComponent.id, { [field.key]: newClassName })}
                />
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

