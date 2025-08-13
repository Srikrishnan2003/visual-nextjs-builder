import { ComponentNode } from "@/types/component-nodes";
import { generateCodeFromTree } from "./codeGenerator";

function extractUsedComponentTypes(tree: ComponentNode[]): Set<string> {
    const used = new Set<string>();

    const traverse = (nodes: ComponentNode[]) => {
        for (const node of nodes) {
            used.add(node.type);
            if (node.children) traverse(node.children);
        }
    };

    traverse(tree);
    return used;
}

export function generateComponentFileCode(tree: ComponentNode[], componentName: string): string {
    const usedTypes = extractUsedComponentTypes(tree);
    usedTypes.delete(componentName);

    const importLines = [...usedTypes].map((type) => `import ${type} from "./${type}";`).join("\n");

    const jsxCode = generateCodeFromTree(tree);
    
    return `${importLines ? importLines + "\n\n" : ""} const ${componentName} = () => {
    return (
        ${jsxCode.split("\n").map((line) => "   "+line).join("\n")}
    );
};

export default ${componentName};`;
}