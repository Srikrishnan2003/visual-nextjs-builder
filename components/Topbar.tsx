'use client';

import { Rocket, Laptop, Tablet, Smartphone, Undo2, Redo2, X } from "lucide-react";
import ExportZipButton from "./ExportZipButton";
import { useCanvasStore } from "@/stores/canvasStore";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "./ui/toast";

export default function Topbar() {
    const { viewport, setViewport, undo, redo, nestingMode, cancelNesting } = useCanvasStore();
    const canUndo = useCanvasStore((state) => state.historyIndex > 0);
    const canRedo = useCanvasStore((state) => state.historyIndex < state.history.length - 1);
    const { toast } = useToast();

    const viewportIconStyle = (current: typeof viewport) => cn(
        "p-2 rounded-lg cursor-pointer transition-colors",
        viewport === current ? "bg-blue-100 text-blue-600" : "hover:bg-slate-100 text-slate-500"
    );

    const historyIconStyle = (disabled: boolean) => cn(
        "p-2 rounded-lg transition-colors",
        disabled ? "text-slate-300 cursor-not-allowed" : "text-slate-500 hover:bg-slate-200 cursor-pointer"
    );

    return (
        <div className="w-full h-16 px-6 border-b border-slate-200 bg-white/80 backdrop-blur-sm flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
                <Rocket className="text-blue-600" size={28} />
                <h1 className="text-2xl font-bold text-slate-800 tracking-tighter">
                    Canvas Builder
                </h1>
            </div>

            <div className="flex items-center gap-4">
                {nestingMode ? (
                    <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={cancelNesting}
                        className="flex items-center gap-1"
                    >
                        <X size={16} /> Cancel Nesting
                    </Button>
                ) : (
                    <div className="flex items-center gap-2 p-1 bg-slate-100/80 rounded-lg">
                        <Undo2 className={historyIconStyle(!canUndo)} onClick={canUndo ? undo : undefined} />
                        <Redo2 className={historyIconStyle(!canRedo)} onClick={canRedo ? redo : undefined} />
                    </div>
                )}

                <div className="flex items-center gap-2 p-1 bg-slate-100/80 rounded-lg">
                    <Laptop className={viewportIconStyle('desktop')} onClick={() => setViewport('desktop')} />
                    <Tablet className={viewportIconStyle('tablet')} onClick={() => setViewport('tablet')} />
                    <Smartphone className={viewportIconStyle('mobile')} onClick={() => setViewport('mobile')} />
                </div>
            </div>

            <div className="space-x-3">
                <Button
                  onClick={() => {
                    toast({
                      title: "Scheduled: Catch up",
                      description: "Friday, February 10, 2023 at 5:57 PM",
                      action: (
                        <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
                      ),
                    })
                  }}
                >
                  Show Toast
                </Button>
                <ExportZipButton />
            </div>            
        </div>
    );
}