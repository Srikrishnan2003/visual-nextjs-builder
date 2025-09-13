"use client";

import { cn } from "@/lib/utils";

interface FlexBoxProps {
  direction?: "row" | "col";
  gap?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "8" | "10" | "12" | "16";
  justifyContent?: "justify-start" | "justify-end" | "justify-center" | "justify-between" | "justify-around" | "justify-evenly";
  alignItems?: "items-start" | "items-end" | "items-center" | "items-baseline" | "items-stretch";
  flexWrap?: "flex-wrap" | "flex-nowrap" | "flex-wrap-reverse";
  alignContent?: "content-start" | "content-end" | "content-center" | "content-between" | "content-around" | "content-evenly";
  className?: string;
  children?: React.ReactNode;
}

export default function FlexBox({
  direction = "row",
  gap = "0",
  justifyContent,
  alignItems,
  flexWrap,
  alignContent,
  className,
  children,
  ...props
}: FlexBoxProps) {
  const classes = cn(
    "flex",
    direction === "row" ? "flex-row" : "flex-col",
    gap !== "0" && `gap-${gap}`,
    justifyContent,
    alignItems,
    flexWrap,
    alignContent,
    className
  );

  return <div className={classes} {...props}>{children}</div>;
}
