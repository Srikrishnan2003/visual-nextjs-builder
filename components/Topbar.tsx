"use client";

import ExportButton from "./ExportButton";
import ExportZipButton from "./ExportZipButton";

export default function Topbar() {
    return (
        <div className="w-full h-12 px-4 border-b bg-white flex items-center justify-between">
            <h1 className="text-sm font-semibold">Canvas Builder</h1>
            <div className="space-x-2">
                <ExportZipButton />
            </div>            
        </div>
    );
}