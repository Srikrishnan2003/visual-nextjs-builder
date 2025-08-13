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
                "bg-gray-200 hover:bg-gray-300 p-1",
                side === "left" ? "rounded-r" : "rounded-l"
            )}
        >
            {side === "left" ? (
                collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />
            ) : (
                collapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />
            )}
        </button>
    );

    return (
        <div className={cn("relative", collapsed ? "w-4" : width, className)}>
            {!collapsed && <div className="h-full">{children}</div>}
            <div
                className={cn(
                    "absolute top-2",
                    side === "left" ? "right-0" : "left-0"
                )}
            >
                {toggleButton}
            </div>
        </div>
    )
}