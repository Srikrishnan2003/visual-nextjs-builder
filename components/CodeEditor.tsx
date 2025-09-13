'use client';

import { useCanvasStore } from "@/stores/canvasStore";
import { generateCodeForNode } from "@/lib/codeGenerator";
import { Editor } from "@monaco-editor/react";
import { useEffect, useState } from "react";

export default function CodeEditor() {
    const { selectedId, selectedComponent } = useCanvasStore();
    const [code, setCode] = useState("// Select a component to see its code");

    // Effect: When the selected component changes, update the editor's code
    useEffect(() => {
        if (selectedComponent) {
            const newCode = generateCodeForNode(selectedComponent);
            setCode(newCode);
        } else {
            setCode("// Select a component to see its code");
        }
    }, [selectedComponent]);

    return (
        <div className="h-full w-full border border-gray-800 flex flex-col rounded-xl shadow-xl bg-gray-950">
            <div className="px-4 py-2 border-b border-gray-900 bg-gray-900">
                <p className="text-xs text-gray-400">
                    {selectedComponent ? `Code for <${selectedComponent.type}>` : "Code Editor"}
                </p>
            </div>
            <div className="flex-1">
                <Editor
                    height="100%"
                    defaultLanguage="javascript"
                    value={code}
                    theme="vs-dark"
                    options={{
                        fontSize: 12,
                        minimap: { enabled: false },
                        readOnly: true // Always read-only as requested
                    }}
                />
            </div>
        </div>
    )
}
