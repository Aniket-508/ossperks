import { Input as InputPrimitive } from "@base-ui/react/input";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

import { Button } from "./button";

const inputVariants = cva(
  "border-input file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 w-full min-w-0 rounded-md border bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 md:text-sm",
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
  },
);

const InputRoot = ({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div
    className={cn(
      "relative [&:has([data-slot=input-suffix])_[data-slot=input]]:pr-22",
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

interface InputIconProps extends useRender.ComponentProps<"svg"> {
  position?: "left" | "right";
}

const InputIcon = ({
  render,
  className,
  position = "left",
  ...props
}: InputIconProps) =>
  useRender({
    defaultTagName: "svg",
    props: mergeProps(
      {
        className: cn(
          "text-fd-muted-foreground pointer-events-none absolute top-1/2 size-4 -translate-y-1/2",
          position === "left"
            ? "left-3 [&~input]:pl-9"
            : "right-3 [&~input]:pr-9",
          className,
        ),
        role: "presentation",
      },
      props,
    ),
    render,
  });

const InputButton = ({
  className,
  size = "xs",
  variant = "outline",
  ...props
}: React.ComponentProps<typeof Button>) => (
  <Button
    data-slot="input-suffix"
    size={size}
    variant={variant}
    className={cn("absolute top-1/2 right-3 -translate-y-1/2", className)}
    {...props}
  />
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

export { Input, InputRoot, InputIcon, InputButton, inputVariants };
