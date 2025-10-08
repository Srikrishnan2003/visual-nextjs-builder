// stores/canvasStore.helpers.ts
import { v4 as uuid } from "uuid";
import { ComponentNode } from "@/types/component-nodes";

// Find a node by its ID in the tree
export function findNodeById(nodes: ComponentNode[], id: string): ComponentNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

// Remove a node from the tree
export function removeNodeById(nodes: ComponentNode[], idToRemove: string): ComponentNode[] {
  return nodes.filter(node => node.id !== idToRemove).map(node => ({
    ...node,
    children: node.children ? removeNodeById(node.children, idToRemove) : node.children,
  }));
}

// Add a node to a specific parent
export function addNodeToParent(nodes: ComponentNode[], parentId: string, nodeToAdd: ComponentNode): ComponentNode[] {
  return nodes.map(node => {
    if (node.id === parentId) {
      return {
        ...node,
        children: [...(node.children || []), nodeToAdd],
      };
    }
    return {
      ...node,
      children: node.children ? addNodeToParent(node.children, parentId, nodeToAdd) : node.children,
    };
  });
}

// Insert component at root or parent level
export function insertComponent(
  tree: ComponentNode[],
  parentId: string | null,
  newNode: ComponentNode
): ComponentNode[] {
  if (!parentId) {
    return [...tree, newNode];
  }

  return tree.map((node) => {
    if (node.id === parentId) {
      const children = node.children ?? [];
      return {
        ...node,
        children: [...children, newNode],
      };
    } else if (node.children) {
      return {
        ...node,
        children: insertComponent(node.children, parentId, newNode),
      };
    }
    return node;
  });
}

// Update component position
export function updateComponentPosition(
  nodes: ComponentNode[],
  idToUpdate: string,
  newX: number,
  newY: number
): ComponentNode[] {
  return nodes.map((node) => {
    if (node.id === idToUpdate) {
      return { ...node, x: newX, y: newY };
    }
    if (node.children) {
      return {
        ...node,
        children: updateComponentPosition(node.children, idToUpdate, newX, newY),
      };
    }
    return node;
  });
}

// Update props of a node by ID
export function updateNodePropsById(
  nodes: ComponentNode[],
  idToUpdate: string,
  newProps: Record<string, any>
): ComponentNode[] {
  let treeHasChanged = false;

  const newNodes = nodes.map((node) => {
    if (node.id === idToUpdate) {
      const hasChanged = Object.keys(newProps).some(
        (key) => node.props[key] !== newProps[key]
      );
      if (hasChanged) {
        treeHasChanged = true;
        return { ...node, props: { ...node.props, ...newProps } };
      }
      return node;
    }
    if (node.children) {
      const newChildren = updateNodePropsById(
        node.children,
        idToUpdate,
        newProps
      );
      if (newChildren !== node.children) {
        treeHasChanged = true;
        return { ...node, children: newChildren };
      }
      return node;
    }
    return node;
  });

  return treeHasChanged ? newNodes : nodes;
}

// Deep clone a component with new IDs
export function cloneComponentWithNewIds(node: ComponentNode): ComponentNode {
  const newId = uuid();
  return {
    ...node,
    id: newId,
    children: node.children?.map(child => cloneComponentWithNewIds(child)),
  };
}

// Create complex component nodes with default children
export function createComplexComponentNode(type: string, parentId?: string): ComponentNode {
  let newComponent: ComponentNode = {
    id: uuid(),
    type,
    props: { children: type },
    x: 0,
    y: 0,
    parentId,
  };

  if (type === "Accordion") {
    const accordionItemId = uuid();
    const accordionTriggerId = uuid();
    const accordionContentId = uuid();
    const headingTextId = uuid();
    const contentTextId = uuid();

    newComponent = {
      ...newComponent,
      children: [
        {
          id: accordionItemId,
          type: "AccordionItem",
          props: { value: `item-${uuid().slice(0, 4)}` },
          x: 0,
          y: 0,
          parentId: newComponent.id,
          children: [
            {
              id: accordionTriggerId,
              type: "AccordionTrigger",
              props: {},
              x: 0, y: 0,
              parentId: accordionItemId,
              children: [
                {
                  id: headingTextId,
                  type: "P",
                  props: { children: "Accordion Heading" },
                  x: 0, y: 0,
                  parentId: accordionTriggerId,
                },
              ],
            },
            {
              id: accordionContentId,
              type: "AccordionContent",
              props: {},
              x: 0, y: 0,
              parentId: accordionItemId,
              children: [
                {
                  id: contentTextId,
                  type: "P",
                  props: { children: "Accordion Content" },
                  x: 0, y: 0,
                  parentId: accordionContentId,
                },
              ],
            },
          ],
        },
      ],
    };
  } else if (type === "Card") {
    const cardId = newComponent.id;
    const cardHeaderId = uuid();
    const cardTitleId = uuid();
    const cardDescriptionId = uuid();
    const cardContentId = uuid();
    const cardFooterId = uuid();

    newComponent = {
      ...newComponent,
      props: { className: "w-full max-w-sm" },
      children: [
        {
          id: cardHeaderId,
          type: "CardHeader",
          props: {},
          x: 0, y: 0, parentId: cardId,
          children: [
            {
              id: cardTitleId,
              type: "CardTitle",
              props: { children: "Card Title" },
              x: 0, y: 0, parentId: cardHeaderId,
            },
            {
              id: cardDescriptionId,
              type: "CardDescription",
              props: { children: "Card Description" },
              x: 0, y: 0, parentId: cardHeaderId,
            },
          ],
        },
        {
          id: cardContentId,
          type: "CardContent",
          props: {},
          x: 0, y: 0, parentId: cardId,
          children: [
            {
              id: uuid(),
              type: "P",
              props: { children: "Card Content" },
              x: 0, y: 0, parentId: cardContentId,
            },
          ],
        },
        {
          id: cardFooterId,
          type: "CardFooter",
          props: {},
          x: 0, y: 0, parentId: cardId,
          children: [
            {
              id: uuid(),
              type: "P",
              props: { children: "Card Footer" },
              x: 0, y: 0, parentId: cardFooterId,
            },
          ],
        },
      ],
    };
  } else if (type === "Tabs") {
    const tabsId = newComponent.id;
    const tabsListId = uuid();
    const tabTrigger1Id = uuid();
    const tabTrigger2Id = uuid();
    const tabsContent1Id = uuid();
    const tabsContent2Id = uuid();
    const tabContentP1Id = uuid();
    const tabContentP2Id = uuid();

    newComponent = {
      ...newComponent,
      props: { defaultValue: "tab1" },
      children: [
        {
          id: tabsListId,
          type: "TabsList",
          props: { className: "flex flex-wrap" },
          x: 0, y: 0, parentId: tabsId,
          children: [
            {
              id: tabTrigger1Id,
              type: "TabsTrigger",
              props: { value: "tab1", children: "Tab 1" },
              x: 0, y: 0, parentId: tabsListId,
            },
            {
              id: tabTrigger2Id,
              type: "TabsTrigger",
              props: { value: "tab2", children: "Tab 2" },
              x: 0, y: 0, parentId: tabsListId,
            },
          ],
        },
        {
          id: tabsContent1Id,
          type: "TabsContent",
          props: { value: "tab1" },
          x: 0, y: 0, parentId: tabsId,
          children: [
            {
              id: tabContentP1Id,
              type: "P",
              props: { children: "Content for Tab 1" },
              x: 0, y: 0, parentId: tabsContent1Id,
            },
          ],
        },
        {
          id: tabsContent2Id,
          type: "TabsContent",
          props: { value: "tab2" },
          x: 0, y: 0, parentId: tabsId,
          children: [
            {
              id: tabContentP2Id,
              type: "P",
              props: { children: "Content for Tab 2" },
              x: 0, y: 0, parentId: tabsContent2Id,
            },
          ],
        },
      ],
    };
  }
  
  return newComponent;
}