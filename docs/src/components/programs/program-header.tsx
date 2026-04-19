"use client";

import { ArrowRightIcon, ListTodoIcon } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";

import { Button } from "@/components/ui/button";
import { LinkText } from "@/components/ui/link-text";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { trackEvent } from "@/lib/events";
import { cn } from "@/lib/utils";

export interface ProgramHeaderLabels {
  apply: {
    short: string;
    text: string;
  };
  check: {
    short: string;
    text: string;
  };
  by: string;
}

export interface ProgramHeaderProps {
  applyUrl: string;
  checkHref: string;
  labels: ProgramHeaderLabels;
  name: string;
  description: string;
  provider: string;
  url: string;
}

export const ProgramHeader = ({
  applyUrl,
  checkHref,
  labels,
  name,
  description,
  provider,
  url,
}: ProgramHeaderProps) => {
  const { ref: ctasRef, isIntersecting: hideCtas } = useIntersectionObserver({
    root: null,
    rootMargin: "-128px 0px 0px 0px",
    threshold: 0,
  });

  const { ref: stickySentinelRef, isIntersecting: headerIsSticky } =
    useIntersectionObserver({
      root: null,
      rootMargin: "-56px 0px 0px 0px",
      threshold: 0,
    });

  const handleApplyProgram = useCallback(() => {
    trackEvent({ name: "apply_program", properties: { url: applyUrl } });
  }, [applyUrl]);

  const ctaButtons = (
    applyLabel: string,
    checkLabel: string,
    tabIndex?: -1,
  ) => (
    <>
      <Button
        nativeButton={false}
        render={
          <a
            href={applyUrl}
            rel="noopener noreferrer"
            tabIndex={tabIndex}
            target="_blank"
            onClick={handleApplyProgram}
          >
            {applyLabel}
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
            tabIndex={tabIndex}
            transitionTypes={["nav-forward"]}
          >
            <ListTodoIcon />
            {checkLabel}
          </Link>
        }
        size="sm"
        variant="outline"
      />
    </>
  );

  return (
    <>
      <div
        ref={stickySentinelRef}
        aria-hidden
        className="pointer-events-none h-px w-full shrink-0"
      />
      <div
        className={cn(
          "bg-fd-background/95 supports-backdrop-filter:bg-fd-background/80 z-20 -mx-1 px-1 py-4 backdrop-blur-md md:sticky md:top-(--header-height) md:border-b md:border-transparent md:transition-colors",
          !headerIsSticky && "md:border-fd-border",
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-3xl font-bold">
            <LinkText href={url}>{name}</LinkText>
          </h1>
          <div
            className={cn(
              "hidden shrink-0 gap-2 md:flex",
              hideCtas ? "pointer-events-none opacity-0" : "opacity-100",
            )}
            aria-hidden={!hideCtas}
          >
            {ctaButtons(
              labels.apply.short,
              labels.check.short,
              hideCtas ? -1 : undefined,
            )}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-fd-muted-foreground text-lg">
          {labels.by} {provider}
        </p>
        <p className="text-fd-foreground mt-4">{description}</p>
        <div ref={ctasRef} className="mt-6 flex flex-col gap-3 sm:flex-row">
          {ctaButtons(
            labels.apply.text,
            labels.check.text,
            hideCtas ? undefined : -1,
          )}
        </div>
      </div>
    </>
  );
};
