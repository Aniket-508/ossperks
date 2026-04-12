"use client";

import { useHotkey } from "@tanstack/react-hotkeys";
import { ChevronLeft, ChevronRight, Link2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  addTransitionType,
  startTransition,
  useCallback,
  useState,
} from "react";

import { isEditableTarget } from "@/components/hotkeys/editable-target";
import {
  FacebookIcon,
  LinkedInIcon,
  RedditIcon,
  WhatsAppIcon,
  XIcon,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { encodeUrlForPath } from "@/lib/url";
import { cn } from "@/lib/utils";

export interface ProgramBottomBarLabels {
  copyLink: string;
  copyLinkTooltip: string;
  linkCopied: string;
  linkCopiedTooltip: string;
  nextProgram: string;
  nextProgramTooltip: string;
  previousProgram: string;
  previousProgramTooltip: string;
  share: string;
  shareOnFacebook: string;
  shareOnLinkedIn: string;
  shareOnReddit: string;
  shareOnWhatsApp: string;
  shareOnX: string;
}

interface ProgramBottomBarProps {
  className?: string;
  labels: ProgramBottomBarLabels;
  nextHref: string | null;
  prevHref: string | null;
  shareText: string;
  shareUrl: string;
}

const buildShareUrls = (url: string, text: string) => {
  const encodedUrl = encodeUrlForPath(url);
  const encodedText = encodeUrlForPath(text);
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    reddit: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedText}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
  };
};

const hotkeyOk = (e: KeyboardEvent) =>
  !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey;

export const ProgramBottomBar = ({
  className,
  labels,
  nextHref,
  prevHref,
  shareText,
  shareUrl,
}: ProgramBottomBarProps) => {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const shareUrls = buildShareUrls(shareUrl, shareText);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [shareUrl]);

  useHotkey("C", async (e) => {
    if (!hotkeyOk(e) || isEditableTarget(document.activeElement)) {
      return;
    }
    e.preventDefault();
    await handleCopy();
  });

  useHotkey("ArrowLeft", (e) => {
    if (!hotkeyOk(e) || isEditableTarget(document.activeElement)) {
      return;
    }
    if (!prevHref) {
      return;
    }
    e.preventDefault();
    startTransition(() => {
      addTransitionType("nav-back");
      router.push(prevHref);
    });
  });

  useHotkey("ArrowRight", (e) => {
    if (!hotkeyOk(e) || isEditableTarget(document.activeElement)) {
      return;
    }
    if (!nextHref) {
      return;
    }
    e.preventDefault();
    startTransition(() => {
      addTransitionType("nav-forward");
      router.push(nextHref);
    });
  });

  return (
    <TooltipProvider delay={200}>
      <div
        className={cn(
          "bg-fd-background/95 supports-backdrop-filter:bg-fd-background/80 border-fd-border sticky bottom-0 z-20 -mx-1 border-t px-1 py-3 backdrop-blur-md",
          className,
        )}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-1">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    aria-label={labels.copyLink}
                    className="shrink-0"
                    onClick={handleCopy}
                    size="icon-sm"
                    variant="outline"
                  >
                    <Link2 className="size-4" />
                  </Button>
                }
              />
              <TooltipContent>
                {copied ? (
                  labels.linkCopiedTooltip
                ) : (
                  <span className="inline-flex items-center gap-1.5">
                    <span>{labels.copyLinkTooltip}</span>
                    <Kbd>C</Kbd>
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={
                  prevHref ? (
                    <Button
                      aria-label={labels.previousProgram}
                      nativeButton={false}
                      render={
                        <Link href={prevHref} transitionTypes={["nav-back"]}>
                          <ChevronLeft className="size-4" />
                        </Link>
                      }
                      size="icon-sm"
                      variant="outline"
                    />
                  ) : (
                    <Button
                      aria-label={labels.previousProgram}
                      disabled
                      size="icon-sm"
                      variant="outline"
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                  )
                }
              />
              <TooltipContent>
                <span className="inline-flex items-center gap-1.5">
                  <span>{labels.previousProgramTooltip}</span>
                  <Kbd aria-label="Left arrow">←</Kbd>
                </span>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={
                  nextHref ? (
                    <Button
                      aria-label={labels.nextProgram}
                      nativeButton={false}
                      render={
                        <Link href={nextHref} transitionTypes={["nav-forward"]}>
                          <ChevronRight className="size-4" />
                        </Link>
                      }
                      size="icon-sm"
                      variant="outline"
                    />
                  ) : (
                    <Button
                      aria-label={labels.nextProgram}
                      disabled
                      size="icon-sm"
                      variant="outline"
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  )
                }
              />
              <TooltipContent>
                <span className="inline-flex items-center gap-1.5">
                  <span>{labels.nextProgramTooltip}</span>
                  <Kbd aria-label="Right arrow">→</Kbd>
                </span>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-fd-muted-foreground hidden text-xs font-medium sm:inline">
              {labels.share}:
            </span>
            <div className="flex flex-wrap items-center gap-1">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      aria-label={labels.shareOnX}
                      nativeButton={false}
                      render={
                        <a
                          href={shareUrls.twitter}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <span className="sr-only">{labels.shareOnX}</span>
                          <XIcon />
                        </a>
                      }
                      size="icon-sm"
                      variant="ghost"
                    />
                  }
                />
                <TooltipContent>{labels.shareOnX}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      aria-label={labels.shareOnLinkedIn}
                      nativeButton={false}
                      render={
                        <a
                          href={shareUrls.linkedin}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <span className="sr-only">
                            {labels.shareOnLinkedIn}
                          </span>
                          <LinkedInIcon />
                        </a>
                      }
                      size="icon-sm"
                      variant="ghost"
                    />
                  }
                />
                <TooltipContent>{labels.shareOnLinkedIn}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      aria-label={labels.shareOnReddit}
                      nativeButton={false}
                      render={
                        <a
                          href={shareUrls.reddit}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <span className="sr-only">
                            {labels.shareOnReddit}
                          </span>
                          <RedditIcon />
                        </a>
                      }
                      size="icon-sm"
                      variant="ghost"
                    />
                  }
                />
                <TooltipContent>{labels.shareOnReddit}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      aria-label={labels.shareOnFacebook}
                      nativeButton={false}
                      render={
                        <a
                          href={shareUrls.facebook}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <span className="sr-only">
                            {labels.shareOnFacebook}
                          </span>
                          <FacebookIcon />
                        </a>
                      }
                      size="icon-sm"
                      variant="ghost"
                    />
                  }
                />
                <TooltipContent>{labels.shareOnFacebook}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      aria-label={labels.shareOnWhatsApp}
                      nativeButton={false}
                      render={
                        <a
                          href={shareUrls.whatsapp}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <span className="sr-only">
                            {labels.shareOnWhatsApp}
                          </span>
                          <WhatsAppIcon />
                        </a>
                      }
                      size="icon-sm"
                      variant="ghost"
                    />
                  }
                />
                <TooltipContent>{labels.shareOnWhatsApp}</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
