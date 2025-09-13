"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface DivProps extends React.ComponentProps<"div"> {
  display?: "block" | "flex";
  flexDirection?: "row" | "col";
  justifyContent?: "justify-start" | "justify-center" | "justify-end" | "justify-between" | "justify-around";
  alignItems?: "items-start" | "items-center" | "items-end" | "items-stretch";
  gap?: "gap-0" | "gap-1" | "gap-2" | "gap-3" | "gap-4" | "gap-5" | "gap-6" | "gap-8";
  padding?: "p-0" | "p-1" | "p-2" | "p-3" | "p-4" | "p-5" | "p-6" | "p-8";
  bgColor?: "bg-white" | "bg-gray-100" | "bg-blue-500" | "bg-red-500" | "bg-green-500" | "bg-yellow-500";
}

export default function Div({
  children,
  className,
  display,
  flexDirection,
  justifyContent,
  alignItems,
  gap,
  padding,
  bgColor,
  ...props
}: DivProps) {
  const combinedClassName = cn(
    display,
    flexDirection,
    justifyContent,
    alignItems,
    gap,
    padding,
    bgColor,
    className
  );

  return <div className={combinedClassName} {...props}>{children}</div>;
}
