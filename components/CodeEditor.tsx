'use client';

import { Editor } from "@monaco-editor/react";

interface CodeEditorProps {
    code: string;
}

export default function CodeEditor({ code }: CodeEditorProps) {
    return (
        <div className="h-full w-full border border-gray-800 flex flex-col rounded-xl shadow-xl bg-gray-950">
            <div className="px-4 py-2 border-b border-gray-900 bg-gray-900">
                <p className="text-xs text-gray-400">
                    Generated Code (app/page.tsx)
                </p>
            </div>
            <div className="flex-1">
                <Editor
                    height="100%"
                    defaultLanguage="typescript" // Changed to typescript for Next.js code
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
