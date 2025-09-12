"use client";

import { cn } from "@/lib/utils";

interface FlexBoxProps {
  direction?: "row" | "col";
  gap?: "0" | "2" | "4" | "6" | "8";
  className?: string;
  children?: React.ReactNode;
}

export default function FlexBox({
  direction = "row",
  gap = "0",
  className,
  children,
}: FlexBoxProps) {
  const classes = cn(
    "flex",
    direction === "row" ? "flex-row" : "flex-col",
    gap !== "0" && `gap-${gap}`,
    className
  );

  return <div className={classes}>{children}</div>;
}
