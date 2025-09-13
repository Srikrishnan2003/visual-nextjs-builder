'use client';

import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ComponentNode } from "@/types/component-nodes";

// This list can be expanded or moved to a central config
const iconNames = ["none", "ArrowRight", "ArrowLeft", "Download", "Upload", "Plus", "Minus", "Check", "X", "Info", "Warning", "Settings", "User"];

interface IconControlProps {
  selectedComponent: ComponentNode;
  updateProps: (id: string, props: Record<string, any>) => void;
}

export function IconControl({ selectedComponent, updateProps }: IconControlProps) {
  const iconName = selectedComponent.props.iconLeft || selectedComponent.props.iconRight || "none";
  const iconPosition = selectedComponent.props.iconLeft ? "left" : selectedComponent.props.iconRight ? "right" : "none";

  const handleIconChange = (newIcon: string) => {
    const isNone = newIcon === 'none';
    const newProps = {
      iconLeft: iconPosition === "left" && !isNone ? newIcon : undefined,
      iconRight: iconPosition === "right" && !isNone ? newIcon : undefined,
    };
    updateProps(selectedComponent.id, newProps);
  };

  const handlePositionChange = (newPosition: "left" | "right" | "none") => {
    const currentIcon = iconName !== "none" ? iconName : undefined;
    const newProps = {
      iconLeft: newPosition === "left" ? currentIcon : undefined,
      iconRight: newPosition === "right" ? currentIcon : undefined,
    };
    updateProps(selectedComponent.id, newProps);
  };

  return (
    <div className="bg-white/80 p-3 rounded-lg shadow-sm border border-slate-100 backdrop-blur-sm space-y-3">
      <h3 className="font-medium text-slate-600">Icon</h3>
      <div className="space-y-1.5">
        <Label htmlFor="icon-name">Icon Name</Label>
        <Select value={iconName} onValueChange={handleIconChange}>
          <SelectTrigger id="icon-name">
            <SelectValue placeholder="Select Icon" />
          </SelectTrigger>
          <SelectContent>
            {iconNames.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label>Icon Position</Label>
        <RadioGroup value={iconPosition} onValueChange={handlePositionChange} className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="pos-none" />
            <Label htmlFor="pos-none">None</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="left" id="pos-left" />
            <Label htmlFor="pos-left">Left</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="right" id="pos-right" />
            <Label htmlFor="pos-right">Right</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
