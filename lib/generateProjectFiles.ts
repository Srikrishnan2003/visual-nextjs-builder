import { useFileSystemStore } from "@/stores/useFileSystemStore";
import { generateComponentFileCode } from "./generateComponentFileCode";
import { generateCodeFromTree } from "./codeGenerator";

export function generateProjectFiles() {
    const { root } = useFileSystemStore.getState();
    const files: { name: string; content: string }[] = [];
    
    function traverse(node: typeof root) {
        if (node.type == 'file') {
            if (node.isCustomComponent && node.canvasTree) {
                const name = node.name;
                const componentName = name.replace(".tsx", "");
                const content = generateComponentFileCode(node.canvasTree, componentName);
                files.push({ name, content });
            } else if (node.name === "index.tsx" && node.canvasTree) {
                const content = generateCodeFromTree(node.canvasTree);
                const indexContent = `const IndexPage = () => {
                    return (
                        ${content.split("\n").map((l) => "  " + l).join("\n")}
                    );
                };
                export default IndexPage;`;

                files.push({ name: "index.tsx", content: indexContent });
            }
        }

        if (node.children) {
            node.children.forEach(traverse);
        }
    }

    traverse(root);
    return files;
}