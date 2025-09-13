"use client";

import ExportButton from "./ExportButton";
import ExportZipButton from "./ExportZipButton";

export default function Topbar() {
    return (
        <div className="w-full h-14 px-6 border-b border-gray-100 bg-white flex items-center justify-between shadow-md">
            <h1 className="text-lg font-bold text-gray-800">Canvas Builder</h1>
            <div className="space-x-2">
                <ExportZipButton />
            </div>            
        </div>
    );
}