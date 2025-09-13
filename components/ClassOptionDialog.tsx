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
        <div className="mt-3 space-y-3">
            <h3 className="font-semibold text-xl text-slate-800">{category} Classes</h3>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 rounded-lg bg-slate-50 border border-slate-100 shadow-inner">
                {options.map((cls) => (
                    <Button
                        key={cls}
                        variant="ghost"
                        className="justify-start text-slate-700 hover:bg-slate-100 rounded-md whitespace-normal break-words text-sm"
                        onClick={() => {
                            onSelect(cls);
                            onClose();
                        }}
                    >
                        {cls}
                    </Button>
                ))}
            </div>
            <Button variant="outline" size="sm" onClick={onClose} className="mt-4 w-full shadow-sm border-slate-200 text-slate-700 hover:bg-slate-100">
                Back
            </Button>
        </div>
    )
}