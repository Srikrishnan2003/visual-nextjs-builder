import { componentRegistry } from "@/lib/componentRegistry";
import { ComponentNode } from "@/types/component-nodes";
import { useCanvasStore } from "@/stores/canvasStore";
import { useFileSystemStore } from "@/stores/useFileSystemStore";

interface ComponentWrapperProps {
  node: ComponentNode;
}

export function ComponentWrapper({ node }: ComponentWrapperProps) {
  const { selectComponent, selectedId, addComponentToParent } = useCanvasStore();
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

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("componentId", node.id);
  };

  const style: React.CSSProperties = {
    top: node.y ?? 0,
    left: node.x ?? 0,
    position: "absolute",
    padding: 4,
    border: isSelected ? "2px solid #3b82f6" : "1px solid #ccc",
    cursor: "move",
  };

  // 🔍 Helper: Find canvasTree for a custom component
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
      <div
        draggable
        onClick={handleClick}
        onDragStart={handleDragStart}
        onContextMenu={handleContextMenu}
        style={style}
      >
        <Comp {...node.props}>
          {node.props.children}
          {node.children?.map((child) => (
            <ComponentWrapper key={child.id} node={child} />
          ))}
        </Comp>
      </div>
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
      style={{
        backgroundColor: "#fee2e2",
        color: "#dc2626",
        padding: 4,
        fontSize: 12,
      }}
    >
      Unknown: {node.type}
    </div>
  );
}
