import JSZip from "jszip";
import { saveAs } from "file-saver";
import { FileNode } from "@/stores/useFileSystemStore";
import { generateCodeFromTree } from "./codeGenerator";

function addToZip(zip: JSZip, node: FileNode, path: string = "") {
    const currentPath = path ? `${path}/${node.name}` : node.name;

    if (node.type === "file" && node.isCustomComponent && node.canvasTree) {
        const code = generateCodeFromTree(node.canvasTree);
        zip.file(currentPath, code);
    }

    else if (node.type === "file" && node.canvasTree) {
        const code = generateCodeFromTree(node.canvasTree);
        zip.file(currentPath, code);
    }

    else if (node.type === "folder" && node.children) {
        const folder = zip.folder(currentPath);
        node.children.forEach((child) => addToZip(folder!, child, currentPath));
    }
}

export async function downloadProjectAsZip(projectRoot: FileNode) {
    const zip = new JSZip();
    projectRoot.children?.forEach((child) => {
        addToZip(zip, child);
    })

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "project.zip");
}