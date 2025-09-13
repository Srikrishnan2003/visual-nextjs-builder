"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsiblePanelProps {
    side: "left" | "right";
    children: React.ReactNode;
    className?: string;
    width?: string;
}

export default function CollapsiblePanel({
    side,
    children,
    className,
    width = "w-60",
}: CollapsiblePanelProps) {
    const [collapsed, setCollapsed] = useState(false);

    const toggleButton = (
        <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
                "bg-blue-600 hover:bg-blue-700 p-1.5 text-white rounded-full shadow-lg border border-blue-700",
                side === "left" ? "rounded-r" : "rounded-l"
            )}
        >
            {side === "left" ? (
                collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />
            ) : (
                collapsed ? <ChevronLeft size={14} /> : <ChevronRight size={14} />
            )}
        </button>
    );

    return (
        <div className={cn("relative", collapsed ? "w-4" : width, className)}>
            {!collapsed && <div className="h-full">{children}</div>}
            <div
                className={cn(
                    "absolute top-1/2 -translate-y-1/2 z-10",
                    side === "left" ? "right-[-16px]" : "left-[-16px]"
                )}
            >
                {toggleButton}
            </div>
        </div>
    )
}