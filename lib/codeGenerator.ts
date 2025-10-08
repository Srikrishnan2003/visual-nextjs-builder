import { ComponentNode } from "@/types/component-nodes";
import { componentRegistry } from "@/lib/componentRegistry";
import { importMap, componentGroupMap } from "./importMap";

// Utility to format custom component name (capitalize first letter)
function formatComponentName(name: string | undefined | null) {
  if (!name || typeof name !== 'string') {
    return 'UnknownComponent'; // Fallback for invalid names
  }
  return name.charAt(0).toUpperCase() + name.slice(1).replace(".tsx", "");
}

function generateCode(
  node: ComponentNode,
  indentLevel = 0,
  usedCustomComponents: Set<string>
): string {
  const { type, props, children = [] } = node;
  const indent = "  ".repeat(indentLevel);

  const { children: innerText, ...restProps } = props || { children: '' };

  const propString = Object.entries(restProps)
    .map(([key, value]) => {
      if (typeof value === "boolean") {
        return value ? key : "";
      }
      if (typeof value === "number") {
        return `${key}={${value}}`;
      }
      return `${key}="${value}"`;
    })
    .filter(Boolean)
    .join(" ");

  const idProp = `id=\" ${node.id}\"`;
  const finalPropString = [idProp, propString].filter(Boolean).join(" ");

  // Check if this is a custom component
  const isCustom = !(type in componentRegistry);
  const formattedType = isCustom ? formatComponentName(type) : type;

  if (isCustom) {
    usedCustomComponents.add(formattedType);
    return `${indent}<${formattedType} />`; // custom components self-close
  }

  const openingTag = finalPropString
    ? `<${formattedType} ${finalPropString}>`
    : `<${formattedType}>`;
  const closingTag = `</${formattedType}>`;

  const textContent = typeof innerText === "string" ? innerText : "";

  const nestedComponentsCode = children
    .map((child) => generateCode(child, indentLevel + 1, usedCustomComponents))
    .join("\n");

  const contentToRender = nestedComponentsCode
    ? nestedComponentsCode
    : (textContent ? indent + "  " + textContent + "\n" : "");

  if (contentToRender) {
    return `${indent}${openingTag}\n${contentToRender}\n${indent}${closingTag}`;
  } else {
    return `${indent}${openingTag}${closingTag}`;
  }
}

function getAllComponentTypes(tree: ComponentNode[]): Set<string> {
    const types = new Set<string>();
    function traverse(nodes: ComponentNode[]) {
        for (const node of nodes) {
            types.add(node.type);
            if (node.children) {
                traverse(node.children);
            }
        }
    }
    traverse(tree);
    return types;
}

// Main function to generate full code with imports
export function generateCodeFromTree(tree: ComponentNode[]): string {
  const usedCustomComponents = new Set<string>();

  const jsx = tree
    .map((node) => generateCode(node, 3, usedCustomComponents))
    .join("\n");

  const wrappedJsx = tree.length > 1 ? `      <>\n${jsx}\n      </>` : jsx;

  const allTypes = getAllComponentTypes(tree);
  const standardImports = new Set<string>();
  for (const componentType of allTypes) {
      if (componentRegistry[componentType]) { // It's a standard component
        const group = componentGroupMap[componentType];
        const importStatement = importMap[group || componentType];
        if (importStatement) {
            standardImports.add(importStatement);
        }
      }
  }

  const customImports = Array.from(usedCustomComponents)
    .map((name) => `import ${name} from "./components/${name}";`)
    .join("\n");

  const allImports = [
    ...Array.from(standardImports),
    customImports
  ].filter(Boolean).join('\n');

  const template = `'use client';

import React from 'react';
${allImports}

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
${wrappedJsx}
    </main>
  );
}
`;
  return template;
}

export function generateCodeForNode(node: ComponentNode): string {
  if (!node) return "";
  // We don't need to track usedCustomComponents for a single node editor
  const usedCustomComponents = new Set<string>();
  return generateCode(node, 0, usedCustomComponents);
}