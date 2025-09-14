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
import { PlusIcon, TrashIcon } from "lucide-react"; // Import icons
import { useState } from "react";
import { AddComponentDialog } from "../components/dialogs/AddComponentDialog"; // Corrected import

export function PropertiesPanel() {
  const { selectedId, selectedComponent: getSelectedComponent, updateProps, startNesting, addAccordionItem, removeComponent, addComponentToParent, selectComponent, addTabItem } = useCanvasStore();

  const selectedComponent = getSelectedComponent();

  const [isAddComponentDialogOpen, setIsAddComponentDialogOpen] = useState(false);

  if (!selectedComponent) {
    return (
      <div className="p-3 border-l border-gray-100 h-full bg-gray-50 rounded-lg shadow-md flex items-center justify-center text-center">
        <p className="text-gray-500 text-sm">No component selected</p>
      </div>
    );
  }

  const isButton = selectedComponent.type === "Button";
  const CONTAINER_TYPES = ["Div", "FlexBox", "CardHeader", "CardContent", "CardFooter", "CardAction", "AccordionItem", "AccordionContent", "TabsContent"];
  const isContainer = CONTAINER_TYPES.includes(selectedComponent.type);
  const isAccordion = selectedComponent.type === "Accordion";
  const isTabs = selectedComponent.type === "Tabs";
  const isTabsList = selectedComponent.type === "TabsList";
  const schema = (propSchemas[selectedComponent.type] || []);

  // Filter out the 'children' prop if the component is AccordionItem
  const componentPropsToRender = { ...selectedComponent.props };
  if (selectedComponent.type === "AccordionItem") {
    delete componentPropsToRender.children;
  }

  return (
    <div className="p-4 h-full space-y-4 bg-slate-100/50 rounded-lg shadow-md overflow-y-auto">
      <h2 className="font-bold text-xl text-slate-900 mb-4 tracking-wide border-b pb-2 border-slate-200">Properties</h2>

      {/* Nesting Button for Divs and FlexBoxes */}
      {isContainer && (
        <Button
          onClick={() => startNesting(selectedComponent.id)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white mb-2"
        >
          Nest a Component
        </Button>
      )}

      {/* Add Item Button for Accordion */}
      {isAccordion && (
        <Button
          onClick={() => addAccordionItem(selectedComponent.id)}
          className="w-full bg-green-500 hover:bg-green-600 text-white mb-2"
        >
          Add Accordion Item
        </Button>
      )}

      {/* Add Item Button for Tabs (main Tabs component) */}
      {isTabs && (
        <Button
          onClick={() => addTabItem(selectedComponent.id)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white mb-2"
        >
          Add Tab Item
        </Button>
      )}

      {/* Add Tab Button for TabsList */}
      {isTabsList && (
        <Button
          onClick={() => addTabItem(selectedComponent.parentId!)}
          className="w-full bg-green-500 hover:bg-green-600 text-white mb-2"
        >
          Add Tab
        </Button>
      )}

      {/* Children Management Section */}
      {selectedComponent.children && selectedComponent.children.length > 0 && (
        <div className="space-y-2 border-t pt-4 border-slate-200">
          <h3 className="font-semibold text-lg text-slate-800">Children</h3>
          {isTabs ? (
            (() => {
              const tabsList = selectedComponent.children.find(child => child.type === "TabsList");
              const tabTriggers = tabsList?.children?.filter(child => child.type === "TabsTrigger") || [];
              const tabContents = selectedComponent.children.filter(child => child.type === "TabsContent");

              const groupedTabItems = tabTriggers.map(trigger => {
                const content = tabContents.find(tc => tc.props.value === trigger.props.value);
                return { trigger, content };
              });

              return groupedTabItems.map((item, index) => (
                <div key={item.trigger.id} className="flex items-center justify-between bg-white p-2 rounded-md shadow-sm border border-slate-200">
                  <span className="text-sm font-medium text-slate-700">Tab Item: {item.trigger.props.value}</span>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => selectComponent(item.trigger.id)} // Select the trigger as the representative
                      className="text-blue-600 hover:bg-blue-50"
                    >
                      Select
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        removeComponent(item.trigger.id);
                        if (item.content) {
                          removeComponent(item.content.id);
                        }
                      }}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ));
            })()
          ) : (
            selectedComponent.children.map((child) => (
              <div key={child.id} className="flex items-center justify-between bg-white p-2 rounded-md shadow-sm border border-slate-200">
                <span className="text-sm font-medium text-slate-700">{child.type}</span>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => selectComponent(child.id)}
                    className="text-blue-600 hover:bg-blue-50"
                  >
                    Select
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeComponent(child.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Component Button for Containers (excluding TabsList) */}
      {isContainer && !isTabsList && (
        <Button
          onClick={() => setIsAddComponentDialogOpen(true)}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white mt-4"
        >
          <PlusIcon className="h-4 w-4 mr-2" /> Add Component
        </Button>
      )}

      {schema
        .filter(field => !(selectedComponent.type === "AccordionItem" && field.label === "Content")) // Filter out "Content" label for AccordionItem
        .map((field) => (
        <PropertyControl
          key={field.key}
          field={field}
          value={componentPropsToRender[field.key]} // Use filtered props here
          componentId={selectedComponent.id}
          updateProps={updateProps}
        />
      ))}

      <AddComponentDialog
        isOpen={isAddComponentDialogOpen}
        onClose={() => setIsAddComponentDialogOpen(false)}
        onAddComponent={(type) => {
          addComponentToParent(type, selectedComponent.id);
          setIsAddComponentDialogOpen(false);
        }}
      />
    </div>
  );
}

