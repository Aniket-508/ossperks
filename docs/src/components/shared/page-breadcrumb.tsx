import { Home } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

export type PageBreadcrumbSegment =
  | { current: true; label: string }
  | { href: string; label: string };

interface PageBreadcrumbProps {
  className?: string;
  homeHref: string;
  homeLabel: string;
  segments: PageBreadcrumbSegment[];
}

export const PageBreadcrumb = ({
  className,
  homeHref,
  homeLabel,
  segments,
}: PageBreadcrumbProps) => (
  <Breadcrumb className={cn("text-fd-muted-foreground mb-4", className)}>
    <BreadcrumbList className="text-fd-muted-foreground sm:gap-2">
      <BreadcrumbItem>
        <BreadcrumbLink
          className="text-fd-muted-foreground hover:text-fd-foreground"
          render={
            <Link
              aria-label={homeLabel}
              className="inline-flex items-center justify-center"
              href={homeHref}
              transitionTypes={["nav-back"]}
            >
              <Home aria-hidden className="size-4" />
            </Link>
          }
        />
      </BreadcrumbItem>
      {segments.map((segment) => (
        <Fragment
          key={"current" in segment ? `current:${segment.label}` : segment.href}
        >
          <BreadcrumbSeparator className="text-fd-muted-foreground" />
          <BreadcrumbItem>
            {"current" in segment ? (
              <BreadcrumbPage className="text-fd-foreground font-normal">
                {segment.label}
              </BreadcrumbPage>
            ) : (
              <BreadcrumbLink
                className="text-fd-muted-foreground hover:text-fd-foreground"
                render={
                  <Link href={segment.href} transitionTypes={["nav-back"]}>
                    {segment.label}
                  </Link>
                }
              />
            )}
          </BreadcrumbItem>
        </Fragment>
      ))}
    </BreadcrumbList>
  </Breadcrumb>
);
