import { ComponentNode } from "@/types/component-nodes";
import { componentRegistry } from "@/lib/componentRegistry";

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

  const idProp = `id="${node.id}"`;
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

  // If there are actual nested components, prioritize them.
  // The 'children' prop (text content) is usually a placeholder for containers.
  const contentToRender = nestedComponentsCode
    ? nestedComponentsCode
    : (textContent ? indent + "  " + textContent + "\n" : "");

  if (contentToRender) {
    return `${indent}${openingTag}\n${contentToRender}\n${indent}${closingTag}`;
  } else {
    return `${indent}${openingTag}${closingTag}`;
  }
}

// Main function to generate full code with imports
export function generateCodeFromTree(tree: ComponentNode[]): string {
  const usedCustomComponents = new Set<string>();

  const jsx = tree
    .map((node) => generateCode(node, 0, usedCustomComponents))
    .join("\n");

  // Wrap multiple root-level components in a React Fragment
  const wrappedJsx = tree.length > 1 ? `<>
${jsx}
</>` : jsx;

  const imports = Array.from(usedCustomComponents)
    .map((name) => `import ${name} from "./components/${name}";`)
    .join("\n");

  return `${imports ? imports + "\n\n" : ""}${wrappedJsx}`;
}

export function generateCodeForNode(node: ComponentNode): string {
  if (!node) return "";
  // We don't need to track usedCustomComponents for a single node editor
  const usedCustomComponents = new Set<string>();
  return generateCode(node, 0, usedCustomComponents);
}
