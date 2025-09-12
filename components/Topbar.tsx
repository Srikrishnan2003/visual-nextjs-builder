"use client";

import ExportButton from "./ExportButton";
import ExportZipButton from "./ExportZipButton";

export default function Topbar() {
    return (
        <div className="w-full h-14 px-6 border-b-2 border-gray-200 bg-gray-50 flex items-center justify-between shadow-sm">
            <h1 className="text-sm font-semibold">Canvas Builder</h1>
            <div className="space-x-2">
                <ExportZipButton />
            </div>            
        </div>
    );
}