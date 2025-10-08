import React from "react";
import { useCallback } from "react";
import { DraggableComponent } from "./Draggable";
import { componentRegistry } from "@/lib/componentRegistry";
import { ComponentNode } from "@/types/component-nodes";
import { useCanvasStore } from "@/stores/canvasStore";
import { useFileSystemStore } from "@/stores/useFileSystemStore";
import { cn } from "@/lib/utils";
import { propSchemas } from "@/lib/componentSchema";
import { ComponentContextMenu } from "./ComponentContextMenu";


interface ComponentWrapperProps {
  node: ComponentNode;
}

export const ComponentWrapper = React.memo(({ node }: ComponentWrapperProps) => {
  const { selectComponent, selectedId, addComponentToParent, moveComponent, nestingMode, nestingTargetId, performNesting, expandedParentId, selectedTabItemIds } = useCanvasStore();
  const { root } = useFileSystemStore();

  const VOID_ELEMENTS = ["Input", "Img", "Br", "Hr"]; // Moved to top

  const Comp = componentRegistry[node.type];
  const isSelected = selectedId === node.id; // Reverted to original selection logic

  const isChildOfExpandedParent = expandedParentId && node.parentId === expandedParentId;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Re-added
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

  const handleDragEnd = useCallback((finalPosition: { x: number; y: number }) => {
    moveComponent(node.id, finalPosition.x, finalPosition.y);
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
    const componentSchema = propSchemas[node.type] || [];
    let baseClassName = "";
    const stylingClasses: string[] = [];
    const otherProps: Record<string, any> = {};

    for (const key in node.props) {
      const propField = componentSchema.find(field => field.key === key);
      if (propField && propField.type === "select" && propField.options) {
        stylingClasses.push(node.props[key]);
      } else if (key === "className") {
        baseClassName = node.props[key];
      } else if (key === "children" && (VOID_ELEMENTS.includes(node.type) || node.type === "Textarea")) {
        // Explicitly skip children prop for void elements and Textarea
        continue;
      } else {
        otherProps[key] = node.props[key];
      }
    }

    const isTabsContent = node.type === 'TabsContent';
    const isTabsContentEmpty = isTabsContent && (!node.children || node.children.length === 0);

    const combinedClassName = cn(
      baseClassName, // Start with the base className from node.props
      isSelected && "border-2 border-blue-500",
      isSelectableForNesting && "border-2 border-dashed border-blue-500 cursor-pointer",
      isChildOfExpandedParent && "border border-dashed border-green-500 bg-green-50",
      isTabsContentEmpty && "border-2 border-dashed border-gray-300", // Added for empty TabsContent
      ...stylingClasses // Add all collected styling classes last to ensure they override
    );

    const presentationProps = { ...otherProps, className: combinedClassName };

    const content = (
      VOID_ELEMENTS.includes(node.type) ? (
        <Comp {...presentationProps} />
      ) : node.type === "Tabs" ? (
        <Comp {...presentationProps}>
          {node.children?.map((child) => (
            <ComponentWrapper key={child.id} node={child} /> // Reverted Tabs children rendering
          ))}
        </Comp>
      ) : node.type === "Textarea" ? (
        <Comp {...presentationProps} defaultValue={node.props.children || ''}>
        </Comp>
      ) : (
        <Comp {...presentationProps}>
          {node.type !== 'Alert' && node.props.children}
          {isTabsContentEmpty && <div className="text-center text-gray-400 p-4">Drop components here</div>}
          {node.children?.map((child) => (
            <ComponentWrapper key={child.id} node={child} />
          ))}
        </Comp>
      )
    );

    if (isChild) {
      // If it's a child, don't make it draggable, let parent layout handle it
      return (
        <div onClick={handleClick} onContextMenu={handleContextMenu}>
          {content}
        </div>
      );
    } else {
      // If it's a top-level component, make it draggable
      return (
        <DraggableComponent
          initialPosition={{ x: node.x ?? 0, y: node.y ?? 0 }}
          onDragEnd={handleDragEnd}
          isSelected={isSelected}
          onClick={handleClick}
          onContextMenu={handleContextMenu}
        >
          <ComponentContextMenu
            componentId={node.id}
          >
                      {content}
          </ComponentContextMenu>
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
          isSelectableForNesting && "border-2 border-dashed border-blue-500 cursor-pointer",
          isChildOfExpandedParent && "border border-dashed border-green-500 bg-green-50"
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
}, (prevProps, nextProps) => {
  // Compare positions too!
  return (
    prevProps.node.id === nextProps.node.id &&
    prevProps.node.x === nextProps.node.x &&
    prevProps.node.y === nextProps.node.y &&
    JSON.stringify(prevProps.node.props) === JSON.stringify(nextProps.node.props) &&
    prevProps.node.children?.length === nextProps.node.children?.length
  );
});

ComponentWrapper.displayName = `ComponentWrapper`;
