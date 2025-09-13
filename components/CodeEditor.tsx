"use client";

import { useCanvasStore } from "@/stores/canvasStore";
import { generateCodeFromTree } from "@/lib/codeGenerator";
import { Editor } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { parseCodeToTree } from "@/lib/codeParser";

export default function CodeEditor() {
    const { canvasTree, setCanvasTree } = useCanvasStore();
    const [code, setCode] = useState(generateCodeFromTree(canvasTree));
    const [debouncedCode] = useDebounce(code, 500);

    useEffect(() => {
        const newCode = generateCodeFromTree(canvasTree);
        if (newCode !== code) {
            setCode(newCode);
        }
    }, [canvasTree]);

    const handleCodeChange = (value: string | undefined) => {
        if (value !== undefined) {
            setCode(value);
        }
    };

    useEffect(() => {
        const newTree = parseCodeToTree(debouncedCode);
        if (newTree.length > 0) {
            setCanvasTree(newTree);
        }
    }, [debouncedCode, setCanvasTree]);

    return (
        <div className="h-full w-full border-l border-gray-700 flex flex-col rounded-xl shadow-xl bg-gray-800">
            <div className="px-4 py-2 border-b border-gray-800 bg-gray-950">
                {/* Toolbar content goes here if needed */}
            </div>
            <div className="flex-1">
                <Editor
                    height="100%"
                    defaultLanguage="javascript"
                    value={code}
                    theme="vs-dark"
                    onChange={handleCodeChange}
                                        options={{
                        fontSize: 14,
                        minimap: { enabled: false },
                        readOnly: true
                    }}
                />
            </div>
        </div>
    )
}