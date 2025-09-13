"use client";

import { 
    Popover,
    PopoverTrigger,
    PopoverContent 
} from "./ui/popover";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { tailwindClassOptions } from "@/lib/tailwindClasses";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { Label } from "./ui/label";

interface ClassSelectorProps {
    selectedClasses: string;
    onUpdate: (value: string) => void;
}

export function ClassSelectorPopover({ selectedClasses, onUpdate }: ClassSelectorProps) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<Record<string, string>>({});

    useEffect(() => {
        const classList = selectedClasses.split(" ").filter(Boolean);
        const selectedPerGroup: Record<string, string> = {};

        for(const [key, { options }] of Object.entries(tailwindClassOptions)) {
            const found = options.find((cls) => classList.includes(cls));
            if (found) selectedPerGroup[key] = found;
        }

        setSelected(selectedPerGroup);
    }, [selectedClasses]);

    const handleSelect = (groupKey: string, cls: string) => {
        setSelected((prev) => ({ ...prev, [groupKey]: cls }));
    };

    const handleApply = () => {
        const finalClasses = new Set<string>();

        for(const [groupKey, cls] of Object.entries(selected)) {
            finalClasses.add(cls);

            const config = tailwindClassOptions[groupKey];
            if(config.required) {
                config.required.forEach((req) => finalClasses.add(req));
            }
        }

        onUpdate(Array.from(finalClasses).join(" "));
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline">Edit Class</Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] max-h-[400px] overflow-auto space-y-4 rounded-lg shadow-lg">
                {Object.entries(tailwindClassOptions).map(([groupKey, group]) => (
                    <div key={groupKey}>
                        <p className="font-semibold mb-1">{group.label}</p>
                        <RadioGroup
                            value={selected[groupKey]}
                            onValueChange={(val) => handleSelect(groupKey, val)}
                            className="flex flex-col gap-1"
                        >
                            {group.options.map((cls) => (
                                <Label key={cls} className="flex items-center gap-2 text-sm">
                                    <RadioGroupItem value={cls} />
                                    {cls}
                                </Label>
                            ))}
                        </RadioGroup>
                    </div>
                ))}

                <div className="flex justify-end pt-2 border-t border-gray-200 mt-4">
                    <Button onClick={handleApply} size="sm">
                        Apply
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}