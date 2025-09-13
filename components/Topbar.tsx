"use client";

import ExportButton from "./ExportButton";
import ExportZipButton from "./ExportZipButton";

export default function Topbar() {
    return (
        <div className="w-full h-16 px-8 border-b border-gray-200 bg-white flex items-center justify-between shadow-lg">
            <h1 className="text-xl font-bold text-gray-900">Canvas Builder</h1>
            <div className="space-x-3">
                <ExportZipButton />
            </div>            
        </div>
    );
}