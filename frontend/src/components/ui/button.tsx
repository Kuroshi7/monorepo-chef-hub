import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "px-4 py-2 rounded bg-primary text-white hover:bg-primary/80 transition", 
      className
    )}
    {...props}
  />
));
Button.displayName = "Button";
