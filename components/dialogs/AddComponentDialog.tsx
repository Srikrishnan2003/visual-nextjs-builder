"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { componentRegistry } from "@/lib/componentRegistry";
import { useState } from "react";

interface AddComponentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddComponent: (type: string) => void;
}

export function AddComponentDialog({ isOpen, onClose, onAddComponent }: AddComponentDialogProps) {
  const MAJOR_COMPONENT_TYPES = [
    "Button", "Div", "FlexBox", "P", "Card", "Accordion", "Tabs", "Alert", "Input", "Textarea", "Checkbox"
  ];
  const availableComponentTypes = Object.keys(componentRegistry).filter(type => MAJOR_COMPONENT_TYPES.includes(type));
  const [searchTerm, setSearchTerm] = useState("");

  const filteredComponentTypes = availableComponentTypes.filter(type =>
    type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Component</DialogTitle>
          <DialogDescription>
            Select a component to add to the canvas.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <input
            type="text"
            placeholder="Search components..."
            className="p-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
            {filteredComponentTypes.map((type) => (
              <Button
                key={type}
                variant="outline"
                onClick={() => onAddComponent(type)}
                className="justify-start"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
        <Button onClick={onClose}>Cancel</Button>
      </DialogContent>
    </Dialog>
  );
}
