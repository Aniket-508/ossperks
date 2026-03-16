import { Input as InputPrimitive } from "@base-ui/react/input";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  "w-full min-w-0 rounded-md border border-input bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
  {
    defaultVariants: {
      inputSize: "default",
    },
    variants: {
      inputSize: {
        default: "h-9 px-2.5 py-1",
        lg: "h-11 px-3 py-2",
        sm: "h-8 px-2 py-0.5",
      },
    },
  }
);

type InputProps = Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants> & {
    size?: React.ComponentProps<"input">["size"];
  };

const Input = ({ className, inputSize, type, ...props }: InputProps) => (
  <InputPrimitive
    type={type}
    data-slot="input"
    className={cn(inputVariants({ inputSize }), className)}
    {...props}
  />
);

export { Input, inputVariants };
