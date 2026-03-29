import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const Breadcrumb = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    aria-label="breadcrumb"
    className={cn(className)}
    data-slot="breadcrumb"
    {...props}
  />
);

const BreadcrumbList = ({
  className,
  ...props
}: React.ComponentProps<"ol">) => (
  <ol
    className={cn(
      "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm wrap-break-word sm:gap-2.5",
      className,
    )}
    data-slot="breadcrumb-list"
    {...props}
  />
);

const BreadcrumbItem = ({
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li
    className={cn("inline-flex items-center gap-1.5", className)}
    data-slot="breadcrumb-item"
    {...props}
  />
);

const BreadcrumbLink = ({
  className,
  render,
  ...props
}: useRender.ComponentProps<"a">) =>
  useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: cn("hover:text-foreground transition-colors", className),
      },
      props,
    ),
    render,
    state: {
      slot: "breadcrumb-link",
    },
  });

const BreadcrumbPage = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-current="page"
    className={cn("text-foreground font-normal", className)}
    data-slot="breadcrumb-page"
    {...props}
  />
);

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li
    aria-hidden="true"
    className={cn("[&>svg]:size-3.5", className)}
    data-slot="breadcrumb-separator"
    role="presentation"
    {...props}
  >
    {children ?? <ChevronRightIcon />}
  </li>
);

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden="true"
    className={cn(
      "flex size-5 items-center justify-center [&>svg]:size-4",
      className,
    )}
    data-slot="breadcrumb-ellipsis"
    role="presentation"
    {...props}
  >
    <MoreHorizontalIcon />
    <span className="sr-only">More</span>
  </span>
);

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
