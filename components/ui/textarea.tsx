import * as React from "react"

import { cn } from "@/lib/utils"
import { Label } from "./label"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    helperText?: string;
    disabled?: boolean;
    readOnly?: boolean;
    rows?: number;
  }

function Textarea({ className, label, helperText, disabled, readOnly, rows, ...restProps }: TextareaProps) {
    return (
      <div className="grid w-full items-center gap-1.5">
        {label && <Label htmlFor={restProps.id}>{label}</Label>}
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          disabled={disabled}
          readOnly={readOnly}
          rows={rows}
          {...restProps}
        />
        {helperText && <p className="text-sm text-muted-foreground">{helperText}</p>}
      </div>
    )
}

Textarea.displayName = "Textarea"

export { Textarea }