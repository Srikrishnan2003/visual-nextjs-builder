"use client";

import { useCanvasStore } from "@/stores/canvasStore";
import { generateCodeFromTree } from "@/lib/codeGenerator";
import { Editor } from "@monaco-editor/react";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { parseCodeToTree } from "@/lib/codeParser";
import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";

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


    const handleFormatCode = () => {
        const formattedCode = prettier.format(code, {
            parser: "babel",
            plugins: [parserBabel],
        });
        setCode(formattedCode);
    };

    return (
        <div className="h-full w-full border-l flex flex-col rounded-lg shadow-inner">
            <div className="p-2 border-b">
                <button
                    onClick={handleFormatCode}
                    className="px-3 py-1 bg-green-500 text-white rounded"
                >
                    Prettify Code
                </button>
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
                        minimap: { enabled: false }
                    }}
                />
            </div>
        </div>
    )
}