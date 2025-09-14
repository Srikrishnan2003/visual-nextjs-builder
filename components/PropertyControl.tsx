
import React from 'react';
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ClassSelectorPopover } from "./ClassSelectorPopover";
import { PropField } from "@/lib/componentSchema";

interface PropertyControlProps {
  field: PropField;
  value: any;
  componentId: string;
  updateProps: (id: string, newProps: Record<string, any>) => void;
}

const PropertyControl: React.FC<PropertyControlProps> = (
  ({ field, value, componentId, updateProps }) => {

    switch (field.type) {
      case "string":
        return (
          <div key={field.key} className="bg-white/80 p-3 rounded-lg shadow-sm border border-slate-100 backdrop-blur-sm">
            <div className="space-y-1.5">
              <Label htmlFor={field.key} className="font-medium text-slate-600">{field.label}</Label>
              <Input
                id={field.key}
                name={field.key}
                value={typeof value === 'string' ? value : ''}
                onChange={(e) => updateProps(componentId, { [field.key]: e.target.value })}
                className="rounded-md border-slate-200 focus:ring-blue-500 focus:border-blue-500 p-2 text-sm"
              />
            </div>
          </div>
        );

      case "boolean":
        return (
          <div key={field.key} className="bg-white/80 p-3 rounded-lg shadow-sm border border-slate-100 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <Label htmlFor={field.key} className="font-medium text-slate-600">{field.label}</Label>
              <Switch
                id={field.key}
                checked={!!value}
                onCheckedChange={(checked) => updateProps(componentId, { [field.key]: checked })}
              />
            </div>
          </div>
        );

      case "select":
        return (
          <div key={field.key} className="bg-white/80 p-3 rounded-lg shadow-sm border border-slate-100 backdrop-blur-sm">
            <div className="space-y-1.5">
              <Label className="font-medium text-slate-600">{field.label}</Label>
              <Select
                value={value}
                onValueChange={(newVal) => updateProps(componentId, { [field.key]: newVal })}
              >
                <SelectTrigger className="border-slate-200 focus:ring-blue-500 focus:border-blue-500 rounded-md p-2 text-sm">
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
          </div>
        );

      case "className":
        return (
          <div key={field.key} className="bg-white/80 p-3 rounded-lg shadow-sm border border-slate-100 backdrop-blur-sm">
            <div className="space-y-1.5">
              <Label className="font-medium text-slate-600">{field.label}</Label>
              <ClassSelectorPopover
                selectedClasses={value}
                onUpdate={(newClassName) => updateProps(componentId, { [field.key]: newClassName })}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  }
);

PropertyControl.displayName = 'PropertyControl';

export default PropertyControl;
