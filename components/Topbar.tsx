'use client';

import { Rocket, Laptop, Tablet, Smartphone } from "lucide-react";
import ExportZipButton from "./ExportZipButton";
import { useCanvasStore } from "@/stores/canvasStore";
import { cn } from "@/lib/utils";

export default function Topbar() {
    const { viewport, setViewport } = useCanvasStore();

    const iconStyle = (current: typeof viewport) => cn(
        "p-2 rounded-lg cursor-pointer transition-colors",
        viewport === current ? "bg-blue-100 text-blue-600" : "hover:bg-slate-100 text-slate-500"
    );

    return (
        <div className="w-full h-16 px-6 border-b border-slate-200 bg-white/80 backdrop-blur-sm flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
                <Rocket className="text-blue-600" size={28} />
                <h1 className="text-2xl font-bold text-slate-800 tracking-tighter">
                    Canvas Builder
                </h1>
            </div>

            <div className="flex items-center gap-2 p-1 bg-slate-100/80 rounded-lg">
                <Laptop className={iconStyle('desktop')} onClick={() => setViewport('desktop')} />
                <Tablet className={iconStyle('tablet')} onClick={() => setViewport('tablet')} />
                <Smartphone className={iconStyle('mobile')} onClick={() => setViewport('mobile')} />
            </div>

            <div className="space-x-3">
                <ExportZipButton />
            </div>            
        </div>
    );
}