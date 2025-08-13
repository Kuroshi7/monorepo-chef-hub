import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary", 
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";
