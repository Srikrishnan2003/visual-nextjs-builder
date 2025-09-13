import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsiblePanelProps {
    side: "left" | "right";
    children: React.ReactNode;
    className?: string;
    width?: string;
    collapsed?: boolean; // New prop
    setCollapsed?: (collapsed: boolean) => void; // New prop
}

export default function CollapsiblePanel({
    side,
    children,
    className,
    width = "w-60",
    collapsed: propCollapsed, // Destructure with alias
    setCollapsed: setPropCollapsed, // Destructure with alias
}: CollapsiblePanelProps) {
    const [localCollapsed, setLocalCollapsed] = useState(propCollapsed ?? false); // Use local state or prop

    // Sync local state with prop if prop changes
    useEffect(() => {
        if (propCollapsed !== undefined) {
            setLocalCollapsed(propCollapsed);
        }
    }, [propCollapsed]);

    const handleToggle = () => {
        const newCollapsedState = !localCollapsed;
        setLocalCollapsed(newCollapsedState);
        if (setPropCollapsed) {
            setPropCollapsed(newCollapsedState);
        }
    };

        const toggleButton = (
        <button
            onClick={handleToggle}
            className={cn(
                "p-1.5 text-slate-400 hover:text-blue-500 hover:bg-slate-200/50 transition-all duration-200 rounded-md",
            )}
        >
            {side === "left" ? (
                localCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />
            ) : (
                localCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />
            )}
        </button>
    );

    return (
        <div className={cn("relative transition-all duration-300", localCollapsed ? "w-4" : width, className)}>
            {/* New handle/header div */}
            <div
                className={cn(
                    "absolute top-0 bottom-0 z-10 flex items-center justify-center cursor-pointer",
                    side === "left" ? "right-0" : "left-0", // Position and border
                    localCollapsed ? "w-full" : "w-6" // Width when expanded/collapsed
                )}
            >
                {toggleButton}
            </div>

            {!localCollapsed && <div className="h-full overflow-hidden">{children}</div>}
        </div>
    )