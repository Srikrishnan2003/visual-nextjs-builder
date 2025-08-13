"use client";

import { useCanvasStore } from "@/stores/canvasStore";
import { generateCodeFromTree } from "@/lib/codeGenerator";
import { Editor } from "@monaco-editor/react";

export default function CodeEditor() {
    const { canvasTree } = useCanvasStore();

    const code = generateCodeFromTree(canvasTree);

    return (
        <div className="h-full w-full border-l">
            <Editor
                height="100%"
                defaultLanguage="javascript"
                value={code}
                theme="vs-dark"
                options={{
                    readOnly: true,
                    fontSize: 14,
                    minimap: { enabled: false }
                }}
            />
        </div>
    )
}