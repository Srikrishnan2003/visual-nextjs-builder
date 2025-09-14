import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import DynamicLucideIcon from "../DynamicLucideIcon"
import { IconName } from "@/lib/iconMapping"
import { X } from "lucide-react"

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
        warning:
          "text-yellow-700 bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-yellow-700/90",
        success:
            "text-green-700 bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-green-700/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const AlertTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5
        className={cn("mb-1 font-medium leading-none tracking-tight", className)}
        {...props}
    />
)
AlertTitle.displayName = "AlertTitle"

const AlertDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <div className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
)
AlertDescription.displayName = "AlertDescription"

const AlertClose = ({ className, ...props }: React.HTMLAttributes<HTMLButtonElement>) => (
    <button
        data-slot="alert-close"
        className={cn(
            "absolute right-2 top-2 rounded-md p-1 text-foreground/50 transition-opacity hover:text-foreground focus:outline-none focus:ring-2 group-hover:opacity-100",
            className
        )}
        {...props}
    >
        <X className="h-4 w-4" />
    </button>
)
AlertClose.displayName = "AlertClose"

interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
    title?: string;
    description?: string;
    icon?: IconName;
    showCloseButton?: boolean;
}

function Alert({ className, variant, title, description, icon, showCloseButton, children, ...props }: AlertProps) {
    return (
        <div
            role="alert"
            className={cn(alertVariants({ variant }), className)}
            {...props}
        >
            {icon && icon !== 'none' && <DynamicLucideIcon name={icon} />}
            <div>
                {title && <AlertTitle>{title}</AlertTitle>}
                {description && <AlertDescription>{description}</AlertDescription>}
                {children}
            </div>
            {showCloseButton && <AlertClose />}
        </div>
    )
}

export { Alert, AlertTitle, AlertDescription, AlertClose }
