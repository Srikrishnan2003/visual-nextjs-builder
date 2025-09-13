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
        <div className="mt-4 space-y-3">
            <h3 className="font-semibold text-lg text-gray-800">{category} Classes</h3>
            <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2 rounded-md bg-gray-50 border border-gray-100">
                {options.map((cls) => (
                    <Button
                        key={cls}
                        variant="ghost"
                        className="justify-start text-gray-700 hover:bg-gray-100 rounded-md"
                        onClick={() => {
                            onSelect(cls);
                            onClose();
                        }}
                    >
                        {cls}
                    </Button>
                ))}
            </div>
            <Button variant="outline" size="sm" onClick={onClose} className="mt-4 w-full">
                Back
            </Button>
        </div>
    )
}