import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    data-slot="pagination"
    {...props}
  />
);

const PaginationContent = ({
  className,
  ...props
}: React.ComponentProps<"ul">) => (
  <ul
    className={cn("flex items-center gap-1", className)}
    data-slot="pagination-content"
    {...props}
  />
);

const PaginationItem = ({ ...props }: React.ComponentProps<"li">) => (
  <li data-slot="pagination-item" {...props} />
);

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">;

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  children,
  ...props
}: PaginationLinkProps) => (
  <Button
    className={cn(className)}
    nativeButton={false}
    render={
      <a
        aria-current={isActive ? "page" : undefined}
        data-active={isActive}
        data-slot="pagination-link"
        {...props}
      >
        {children ?? <span className="sr-only">Page</span>}
      </a>
    }
    size={size}
    variant={isActive ? "outline" : "ghost"}
  />
);

const PaginationPrevious = ({
  className,
  text = "Previous",
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) => (
  <PaginationLink
    aria-label="Go to previous page"
    className={cn("pl-2!", className)}
    size="default"
    {...props}
  >
    <ChevronLeftIcon data-icon="inline-start" />
    <span className="hidden sm:block">{text}</span>
  </PaginationLink>
);

const PaginationNext = ({
  className,
  text = "Next",
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) => (
  <PaginationLink
    aria-label="Go to next page"
    className={cn("pr-2!", className)}
    size="default"
    {...props}
  >
    <span className="hidden sm:block">{text}</span>
    <ChevronRightIcon data-icon="inline-end" />
  </PaginationLink>
);

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn(
      "flex size-9 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
      className,
    )}
    data-slot="pagination-ellipsis"
    {...props}
  >
    <MoreHorizontalIcon />
    <span className="sr-only">More pages</span>
  </span>
);

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
