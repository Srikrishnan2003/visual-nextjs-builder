"use client";

import { Dialog } from "./ui/dialog";
import { Button } from "./ui/button";

interface ClassOptionProps {
    category: string;
    options: string[];
    onSelect: (className: string) => void;
    onClose: () => void;
}

export function ClassOptionDialog({ category, options, onSelect, onClose }: ClassOptionProps) {
    return (
        <div className="mt-6 space-y-2">
            <h3 className="font-semibold">{category} Classes</h3>
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                {options.map((cls) => (
                    <Button
                        key={cls}
                        variant="ghost"
                        className="justify-start"
                        onClick={() => {
                            onSelect(cls);
                            onClose();
                        }}
                    >
                        {cls}
                    </Button>
                ))}
            </div>
            <Button variant="outline" size="sm" onClick={onClose} className="mt-2">
                Back
            </Button>
        </div>
    )
}