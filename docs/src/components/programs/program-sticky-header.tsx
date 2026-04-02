"use client";

import { ArrowRightIcon, ListTodoIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { LinkText } from "@/components/ui/link-text";
import { cn } from "@/lib/utils";

export interface ProgramStickyHeaderLabels {
  applyShort: string;
  checkShort: string;
}

interface ProgramStickyHeaderProps {
  applyUrl: string;
  checkHref: string;
  introSlot: ReactNode;
  contentSlot: ReactNode;
  labels: ProgramStickyHeaderLabels;
  programName: string;
  programUrl: string;
  bottomBar: ReactNode;
}

export const ProgramStickyHeader = ({
  applyUrl,
  bottomBar,
  checkHref,
  contentSlot,
  introSlot,
  labels,
  programName,
  programUrl,
}: ProgramStickyHeaderProps) => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [showCompactActions, setShowCompactActions] = useState(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowCompactActions(!entry.isIntersecting);
      },
      { root: null, rootMargin: "0px", threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex min-w-0 flex-col">
      <div
        className={cn(
          "bg-fd-background/95 supports-backdrop-filter:bg-fd-background/80 border-fd-border/60 sticky top-16 z-20 -mx-1 border-b px-1 pb-2 backdrop-blur-md",
        )}
      >
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="text-fd-foreground min-w-0 flex-1 truncate text-sm font-semibold md:text-base">
            <LinkText href={programUrl} showExternalIcon={false}>
              {programName}
            </LinkText>
          </div>
          <div
            className={cn(
              "flex shrink-0 gap-2 transition-opacity duration-200",
              showCompactActions
                ? "opacity-100"
                : "pointer-events-none invisible opacity-0",
            )}
            aria-hidden={!showCompactActions}
          >
            <Button
              nativeButton={false}
              render={
                <a
                  href={applyUrl}
                  rel="noopener noreferrer"
                  tabIndex={showCompactActions ? undefined : -1}
                  target="_blank"
                >
                  {labels.applyShort}
                  <ArrowRightIcon />
                </a>
              }
              size="sm"
              variant="default"
            />
            <Button
              nativeButton={false}
              render={
                <Link
                  href={checkHref}
                  tabIndex={showCompactActions ? undefined : -1}
                >
                  <ListTodoIcon />
                  {labels.checkShort}
                </Link>
              }
              size="sm"
              variant="outline"
            />
          </div>
        </div>
      </div>

      <div className="min-w-0 pt-4">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">
            <LinkText href={programUrl}>{programName}</LinkText>
          </h1>
          {introSlot}
        </div>

        <div
          aria-hidden
          className="pointer-events-none h-px w-full"
          ref={sentinelRef}
        />

        {contentSlot}
      </div>

      {bottomBar}
    </div>
  );
};
