"use client";

import { useCanvasStore } from "@/stores/canvasStore";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch"; // add a switch for boolean fields
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"; // for dropdown
import { ClassSelectorPopover } from "./ClassSelectorPopover";
import { ComponentNode } from "@/types/component-nodes";
import { propSchemas } from "@/lib/componentSchema";

export function PropertiesPanel() {
  const { canvasTree, selectedId, updateProps } = useCanvasStore();

  function findNodeById(nodes: ComponentNode[], id: string): ComponentNode | null {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  const selectedComponent = selectedId ? findNodeById(canvasTree, selectedId) : null;

  if (!selectedComponent) {
    return (
      <div className="p-4 border-l h-full">
        <p className="text-muted-foreground">No component selected</p>
      </div>
    );
  }

  const schema = propSchemas[selectedComponent.type] || [];

  return (
    <div className="p-4 border-l h-full space-y-4">
      <h2 className="font-bold text-lg">Properties</h2>

      {schema.map((field) => {
        const value = selectedComponent.props[field.key] || "";

        switch (field.type) {
          case "string":
            return (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key}>{field.label}</Label>
                <Input
                  id={field.key}
                  name={field.key}
                  value={value}
                  onChange={(e) => updateProps(selectedComponent.id, { [field.key]: e.target.value })}
                />
              </div>
            );

          case "boolean":
            return (
              <div key={field.key} className="flex items-center justify-between">
                <Label htmlFor={field.key}>{field.label}</Label>
                <Switch
                  id={field.key}
                  checked={!!value}
                  onCheckedChange={(checked) => updateProps(selectedComponent.id, { [field.key]: checked })}
                />
              </div>
            );

          case "select":
            return (
              <div key={field.key} className="space-y-2">
                <Label>{field.label}</Label>
                <Select
                  value={value}
                  onValueChange={(newVal) => updateProps(selectedComponent.id, { [field.key]: newVal })}
                >
                  <SelectTrigger className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
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
              <div key={field.key} className="space-y-2">
                <Label>{field.label}</Label>
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

