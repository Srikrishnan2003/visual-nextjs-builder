import { useCallback } from "react";
import { DraggableComponent } from "./Draggable";
import { componentRegistry } from "@/lib/componentRegistry";
import { ComponentNode } from "@/types/component-nodes";
import { useCanvasStore } from "@/stores/canvasStore";
import { useFileSystemStore } from "@/stores/useFileSystemStore";

interface ComponentWrapperProps {
  node: ComponentNode;
}

export function ComponentWrapper({ node }: ComponentWrapperProps) {
  const { selectComponent, selectedId, addComponentToParent, moveComponent } = useCanvasStore();
  const { root } = useFileSystemStore();

  const Comp = componentRegistry[node.type];
  const isSelected = selectedId === node.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectComponent(node.id);
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

  // ✅ Case 1: Built-in Component → absolute + draggable
  if (Comp) {
    return (
      <DraggableComponent
        initialPosition={{ x: node.x ?? 0, y: node.y ?? 0 }}
        onPositionChange={handlePositionChange}
        onClick={handleClick}
        isSelected={isSelected}
        disabled={isChild}
        onContextMenu={handleContextMenu}
        className="" // Remove padding, DraggableComponent handles styling
      >
        <Comp {...node.props}>
          {node.props.children}
          {node.children?.map((child) => (
            <ComponentWrapper key={child.id} node={child} />
          ))}
        </Comp>
      </DraggableComponent>
    );
  }

  // ✅ Case 2: Custom Component → just render internal layout, no drag or position
  if (customTree) {
    return (
      <div onClick={handleClick} onContextMenu={handleContextMenu}>
        {customTree.map((childNode) => (
          <ComponentWrapper key={childNode.id} node={childNode} />
        ))}
      </div>
    );
  }

  // ❌ Fallback: unknown component
  return (
    <div
      className="bg-red-100 text-red-700 p-2 text-xs rounded"
    >
      Unknown: {node.type}
    </div>
  );
}