"use client";

import { Rocket } from "lucide-react";
import ExportZipButton from "./ExportZipButton";

export default function Topbar() {
    return (
        <div className="w-full h-16 px-6 border-b border-slate-200 bg-white/80 backdrop-blur-sm flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
                <Rocket className="text-blue-600" size={28} />
                <h1 className="text-2xl font-bold text-slate-800 tracking-tighter">
                    Canvas Builder
                </h1>
            </div>
            <div className="space-x-3">
                <ExportZipButton />
            </div>            
        </div>
    );
}