// components/ComponentContextMenu.tsx
"use client";

import { useCanvasStore } from "@/stores/canvasStore";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Copy, Scissors, Clipboard, Trash2, Layers } from "lucide-react";

interface ComponentContextMenuProps {
  componentId: string;
  children: React.ReactNode;
}

export function ComponentContextMenu({ componentId, children }: ComponentContextMenuProps) {
  const { 
    copyComponent, 
    pasteComponent, 
    duplicateComponent, 
    removeComponent,
    startNesting,
    selectedComponent 
  } = useCanvasStore();

  const component = selectedComponent();
  const isContainer = component && ['Div', 'FlexBox', 'CardHeader', 'CardContent', 'CardFooter', 'CardAction', 'AccordionItem', 'AccordionContent', 'TabsContent'].includes(component.type);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={() => copyComponent(componentId)}>
          <Copy className="mr-2 h-4 w-4" />
          Copy
        </ContextMenuItem>
        <ContextMenuItem onClick={() => {
          copyComponent(componentId);
          removeComponent(componentId);
        }}>
          <Scissors className="mr-2 h-4 w-4" />
          Cut
        </ContextMenuItem>
        <ContextMenuItem onClick={() => pasteComponent()}>
          <Clipboard className="mr-2 h-4 w-4" />
          Paste
        </ContextMenuItem>
        <ContextMenuItem onClick={() => duplicateComponent(componentId)}>
          <Layers className="mr-2 h-4 w-4" />
          Duplicate
        </ContextMenuItem>
        
        {isContainer && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => startNesting(componentId)}>
              <Layers className="mr-2 h-4 w-4" />
              Nest Component Into This
            </ContextMenuItem>
          </>
        )}
        
        <ContextMenuSeparator />
        <ContextMenuItem 
          onClick={() => {
            if (confirm(`Delete ${component?.type}?`)) {
              removeComponent(componentId);
            }
          }}
          className="text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}