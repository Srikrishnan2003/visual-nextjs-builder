'use client';

import { useCanvasStore } from "@/stores/canvasStore";
import { generateCodeForNode } from "@/lib/codeGenerator";
import { parseCodeToState } from "@/lib/astUtils";
import { Editor } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { ComponentNode } from "@/types/component-nodes";

// Helper function to find a node by its ID in the tree
const findNodeById = (nodes: ComponentNode[], id: string): ComponentNode | null => {
    for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
            const found = findNodeById(node.children, id);
            if (found) return found;
        }
    }
    return null;
};

export default function CodeEditor() {
    const { canvasTree, selectedId, updateProps } = useCanvasStore();
    const [code, setCode] = useState("// Select a component to see its code");
    const [debouncedCode] = useDebounce(code, 500);

    const selectedComponent = selectedId ? findNodeById(canvasTree, selectedId) : null;

    // Effect 1: When the selected component changes, update the editor's code
    useEffect(() => {
        if (selectedComponent) {
            const newCode = generateCodeForNode(selectedComponent);
            setCode(newCode);
        } else {
            setCode("// Select a component to see its code");
        }
    }, [selectedComponent]);

    // Effect 2: When the user's code changes (debounced), parse it and update the store
    useEffect(() => {
        if (!selectedId || !debouncedCode || debouncedCode.startsWith('//')) {
            return;
        }

        // Avoid updating if the code hasn't actually changed
        if (selectedComponent && generateCodeForNode(selectedComponent) === debouncedCode) {
            return;
        }

        const newProps = parseCodeToState(debouncedCode);

        // Basic validation to prevent wiping props on parse error
        if (Object.keys(newProps).length > 0) {
            updateProps(selectedId, newProps);
        }
    }, [debouncedCode, selectedId, updateProps, selectedComponent]);

    const handleCodeChange = (value: string | undefined) => {
        if (value !== undefined) {
            setCode(value);
        }
    };

    return (
        <div className="h-full w-full border border-gray-800 flex flex-col rounded-xl shadow-xl bg-gray-950">
            <div className="px-4 py-2 border-b border-gray-900 bg-gray-900">
                <p className="text-xs text-gray-400">
                    {selectedComponent ? `Editing: <${selectedComponent.type}>` : "Code Editor"}
                </p>
            </div>
            <div className="flex-1">
                <Editor
                    height="100%"
                    defaultLanguage="javascript"
                    value={code}
                    theme="vs-dark"
                    onChange={handleCodeChange}
                    options={{
                        fontSize: 12,
                        minimap: { enabled: false },
                        // The editor is only active when a component is selected
                        readOnly: !selectedComponent
                    }}
                />
            </div>
        </div>
    )
}
