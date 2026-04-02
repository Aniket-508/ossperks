import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const Kbd = ({ className, ...props }: ComponentProps<"kbd">) => (
  <kbd
    className={cn(
      "bg-muted text-muted-foreground in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background dark:in-data-[slot=tooltip-content]:bg-background/10 pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm px-1 font-sans text-xs font-medium select-none [&_svg:not([class*='size-'])]:size-3",
      className,
    )}
    data-slot="kbd"
    {...props}
  />
);

const KbdGroup = ({ className, ...props }: ComponentProps<"div">) => (
  <kbd
    className={cn("inline-flex items-center gap-1", className)}
    data-slot="kbd-group"
    {...props}
  />
);

export { Kbd, KbdGroup };
