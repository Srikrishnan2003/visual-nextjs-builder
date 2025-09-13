import React from "react";
import { AccordionItem as AccordionRadixItem } from "./ui/accordion";

interface AccordionItemProps {
  value: string;
  children?: React.ReactNode; // Expects AccordionTrigger and AccordionContent as children
}

export default function AccordionItem({ value, children }: AccordionItemProps) {
  return (
    <AccordionRadixItem value={value}>
      {children}
    </AccordionRadixItem>
  );
}
