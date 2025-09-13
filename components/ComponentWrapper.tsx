import { useCallback } from "react";
import { DraggableComponent } from "./Draggable";
import { componentRegistry } from "@/lib/componentRegistry";
import { ComponentNode } from "@/types/component-nodes";
import { useCanvasStore } from "@/stores/canvasStore";
import { useFileSystemStore } from "@/stores/useFileSystemStore";
import { cn } from "@/lib/utils";

interface ComponentWrapperProps {
  node: ComponentNode;
}

export function ComponentWrapper({ node }: ComponentWrapperProps) {
  const { selectComponent, selectedId, addComponentToParent, moveComponent, nestingMode, nestingTargetId, performNesting } = useCanvasStore();
  const { root } = useFileSystemStore();

  const Comp = componentRegistry[node.type];
  const isSelected = selectedId === node.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (nestingMode) {
      if (node.id === nestingTargetId) {
        // Clicking on the target div itself, do nothing or show a message
        console.log("Cannot nest a component into itself or its target div.");
        return;
      }
      // Perform nesting if in nesting mode and not clicking the target div
      performNesting(node.id);
    } else {
      // Normal selection mode
      selectComponent(node.id);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const confirmAdd = confirm("Add a Button inside this component?");
    if (confirmAdd) {
      addComponentToParent("Button", node.id);
    }
  };

  const isChild = !!node.parentId;

  const handlePositionChange = useCallback((newPosition: { x: number; y: number }) => {
    moveComponent(node.id, newPosition.x, newPosition.y);
  }, [node.id, moveComponent]);

  // ✂️ Helper: Find canvasTree for a custom component
  const findCustomComponentTree = (name: string): ComponentNode[] | null => {
    const search = (node: typeof root): ComponentNode[] | null => {
      if (
        node.type === "file" &&
        node.isCustomComponent &&
        node.name.replace(".tsx", "") === name
      ) {
        return node.canvasTree || [];
      }
      if (node.children) {
        for (const child of node.children) {
          const result = search(child);
          if (result) return result;
        }
      }
      return null;
    };
    return search(root);
  };

  const customTree = !Comp ? findCustomComponentTree(node.type) : null;

  // Determine if the component is selectable for nesting
  const isSelectableForNesting = nestingMode && node.id !== nestingTargetId;

  // ✅ Case 1: Built-in Component
  if (Comp) {
    const commonProps = {
      onClick: handleClick,
      onContextMenu: handleContextMenu,
      className: cn(
        isSelected && "border-2 border-blue-500",
        isSelectableForNesting && "border-2 border-dashed border-blue-500 cursor-pointer",
        "" // Remove padding, DraggableComponent handles styling
      )
    };

    const content = (
      node.type === "Accordion" ? (
        <Comp
          {...node.props}
          collapsible={!!node.props.collapsible}
        >
          {node.props.children}
          {node.children?.map((child) => (
            <ComponentWrapper key={child.id} node={child} />
          ))}
        </Comp>
      ) : (
        <Comp {...node.props}>
          {node.props.children}
          {node.children?.map((child) => (
            <ComponentWrapper key={child.id} node={child} />
          ))}
        </Comp>
      )
    );

    if (isChild) {
      // If it's a child, don't make it draggable, let parent layout handle it
      return (
        <div {...commonProps}>
          {content}
        </div>
      );
    } else {
      // If it's a top-level component, make it draggable
      return (
        <DraggableComponent
          initialPosition={{ x: node.x ?? 0, y: node.y ?? 0 }}
          onPositionChange={handlePositionChange}
          isSelected={isSelected}
          {...commonProps}
        >
          {content}
        </DraggableComponent>
      );
    }
  }

  // ✅ Case 2: Custom Component → just render internal layout, no drag or position
  if (customTree) {
    return (
      <div 
        onClick={handleClick} 
        onContextMenu={handleContextMenu}
        className={cn(
          isSelected && "border-2 border-blue-500",
          isSelectableForNesting && "border-2 border-dashed border-blue-500 cursor-pointer"
        )}
      >
        {customTree.map((childNode) => (
          <ComponentWrapper key={childNode.id} node={childNode} />
        ))}
      </div>
    );
  }

  // ❌ Fallback: unknown component
  return (
    <div
      className="bg-red-100 text-red-700 p-2 text-xs rounded-sm border border-red-100 shadow-xs break-words"
    >
      Unknown: {node.type}
    </div>
  );
}