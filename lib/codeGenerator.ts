import { ComponentNode } from "@/types/component-nodes";
import { componentRegistry } from "@/lib/componentRegistry";

// Utility to format custom component name (capitalize first letter)
function formatComponentName(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1).replace(".tsx", "");
}

function generateCode(
  node: ComponentNode,
  indentLevel = 0,
  usedCustomComponents: Set<string>
): string {
  const { type, props, children = [] } = node;
  const indent = "  ".repeat(indentLevel);

  const { children: innerText, ...restProps } = props || {};

  const propString = Object.entries(restProps)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  // Check if this is a custom component
  const isCustom = !(type in componentRegistry);
  const formattedType = isCustom ? formatComponentName(type) : type;

  if (isCustom) {
    usedCustomComponents.add(formattedType);
    return `${indent}<${formattedType} />`; // custom components self-close
  }

  const openingTag = propString
    ? `<${formattedType} ${propString}>`
    : `<${formattedType}>`;
  const closingTag = `</${formattedType}>`;

  const textContent = typeof innerText === "string" ? innerText : "";

  const nestedComponents = children
    .map((child) => generateCode(child, indentLevel + 1, usedCustomComponents))
    .join("\n");

  if (nestedComponents || textContent) {
    return `${indent}${openingTag}
${textContent ? indent + "  " + textContent + "\n" : ""}${nestedComponents}
${indent}${closingTag}`;
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

  const imports = Array.from(usedCustomComponents)
    .map((name) => `import ${name} from "./components/${name}";`)
    .join("\n");

  return `${imports ? imports + "\n\n" : ""}${jsx}`;
}
