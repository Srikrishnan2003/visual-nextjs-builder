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
import { Input } from "./ui/input";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./ui/accordion";

interface ClassSelectorProps {
    selectedClasses: string;
    onUpdate: (value: string) => void;
}

export function ClassSelectorPopover({ selectedClasses, onUpdate }: ClassSelectorProps) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<Record<string, string>>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [openAccordionItems, setOpenAccordionItems] = useState<string[]>([]);

    useEffect(() => {
        const classList = (selectedClasses || "").split(" ").filter(Boolean);
        const selectedPerGroup: Record<string, string> = {};

        for(const [key, { options }] of Object.entries(tailwindClassOptions)) {
            const found = options.find((cls) => classList.includes(cls));
            if (found) selectedPerGroup[key] = found;
        }

        setSelected(selectedPerGroup);
    }, [selectedClasses]);

    useEffect(() => {
        if (searchQuery) {
            const matchingGroups = Object.entries(tailwindClassOptions)
                .filter(([groupKey, group]) =>
                    group.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    group.options.some(cls => cls.toLowerCase().includes(searchQuery.toLowerCase()))
                )
                .map(([groupKey]) => groupKey);
            setOpenAccordionItems(matchingGroups);
        } else {
            setOpenAccordionItems([]); // Close all when search is cleared
        }
    }, [searchQuery]);

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
                <Button variant="outline" className="shadow-sm rounded-md border-slate-200 text-slate-700 hover:bg-slate-100">Edit Class</Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] max-h-[400px] overflow-auto space-y-4 rounded-xl shadow-xl bg-white/90 backdrop-blur-sm p-5 border border-slate-100">
                <Input
                    placeholder="Search classes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mb-4"
                />
                <Accordion
                    type="multiple"
                    className="w-full"
                    value={openAccordionItems}
                    onValueChange={setOpenAccordionItems}
                >
                    {Object.entries(tailwindClassOptions)
                        .filter(([groupKey, group]) => // Filter groups
                            group.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            group.options.some(cls => cls.toLowerCase().includes(searchQuery.toLowerCase()))
                        )
                        .map(([groupKey, group]) => {
                            const filteredOptions = (searchQuery && !group.label.toLowerCase().includes(searchQuery.toLowerCase()))
                                ? group.options.filter(cls => cls.toLowerCase().includes(searchQuery.toLowerCase()))
                                : group.options;

                            if (filteredOptions.length === 0 && !group.label.toLowerCase().includes(searchQuery.toLowerCase())) {
                                return null; // Don't render group if no options match and group label doesn't match
                            }

                            return (
                                <AccordionItem value={groupKey} key={groupKey}>
                                    <AccordionTrigger className="font-semibold text-slate-700 whitespace-normal break-words text-md py-2">
                                        {group.label}
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <RadioGroup
                                            value={selected[groupKey]}
                                            onValueChange={(val) => handleSelect(groupKey, val)}
                                            className="flex flex-col gap-1 overflow-y-auto"
                                        >
                                            {filteredOptions.map((cls) => ( // Use filteredOptions
                                                <Label key={cls} className="flex items-center gap-2 text-sm hover:bg-slate-50 rounded-md px-2 py-1 whitespace-normal break-words cursor-pointer">
                                                    <RadioGroupItem value={cls} />
                                                    {cls}
                                                </Label>
                                            ))}
                                        </RadioGroup>
                                    </AccordionContent>
                                </AccordionItem>
                            );
                        })}
                </Accordion>

                <div className="flex justify-end pt-3 border-t border-slate-100 mt-4">
                    <Button onClick={handleApply} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-md rounded-lg px-4 py-2">
                        Apply
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}