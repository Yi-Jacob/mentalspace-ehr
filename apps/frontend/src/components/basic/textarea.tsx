import * as React from "react"
import { Label } from "@/components/basic/label"
import { cn } from "@/utils/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

interface TextareaFieldProps extends TextareaProps {
  label?: string;
  required?: boolean;
  containerClassName?: string;
}

const TextareaField = React.forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, required, containerClassName, className, ...props }, ref) => {
    return (
      <div className={containerClassName}>
        {label && (
          <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">
            {label}{required && " *"}
          </Label>
        )}
        <Textarea ref={ref} className={className} {...props} />
      </div>
    );
  }
);
TextareaField.displayName = "TextareaField";

export { Textarea, TextareaField }
