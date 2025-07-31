import * as React from "react"
import { Label } from "@/components/basic/label"
import { cn } from "@/utils/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

// Form Field Components
interface FormFieldProps {
  label?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  required = false, 
  className = "",
  children 
}) => {
  return (
    <div className={className}>
      {label && (
        <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">
          {label}{required && " *"}
        </Label>
      )}
      {children}
    </div>
  );
};

interface InputFieldProps extends React.ComponentProps<"input"> {
  label?: string;
  required?: boolean;
  containerClassName?: string;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, required, containerClassName, className, ...props }, ref) => {
    return (
      <FormField label={label} required={required} className={containerClassName}>
        <Input ref={ref} className={className} {...props} />
      </FormField>
    );
  }
);
InputField.displayName = "InputField";

export { Input, FormField, InputField }
