"use client";

import { Button } from "./ui/button";
import { useCanvasStore } from "@/stores/canvasStore";
import { generateCodeFromTree } from "@/lib/codeGenerator";
import { downloadTextFile } from "@/lib/downloadFile";

export default function ExportButton() {
  const { canvasTree } = useCanvasStore();

  const handleExport = () => {
    const code = generateCodeFromTree(canvasTree);
    const wrapped = `export default function MyComponent() {\n  return (\n${code
      .split("\n")
      .map((line) => "    " + line)
      .join("\n")}\n  );\n}`;
    downloadTextFile("MyComponent.tsx", wrapped);
  };

  return (
    <Button onClick={handleExport} variant="outline" className="w-full">
      Export as .tsx
    </Button>
  );
}
