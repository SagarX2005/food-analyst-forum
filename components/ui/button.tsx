import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-[#0a2a4a] text-white shadow hover:bg-[#071d34] dark:bg-[#0a2a4a] dark:hover:bg-[#123962]",
        navy: "bg-[#0a2a4a] text-white rounded-full font-semibold shadow hover:bg-[#071d34] hover:shadow-md",
        green: "bg-[#4a9d23] text-white rounded-full font-semibold shadow hover:bg-[#3d831d] hover:shadow-md",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-[#4a9d23] text-white shadow-sm hover:bg-[#3d831d]",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-[#0a2a4a] dark:text-[#4a9d23] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-8 rounded-md px-3 text-xs",
        md: "h-10 px-5 py-2.5 text-sm",
        lg: "h-12 rounded-lg px-8 text-base",
        pill: "h-11 px-7 py-2.5 rounded-full text-sm font-semibold",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
