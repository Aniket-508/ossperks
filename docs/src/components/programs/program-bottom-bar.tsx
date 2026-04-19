"use client";

import { useHotkey } from "@tanstack/react-hotkeys";
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LinkIcon,
  EllipsisIcon,
  ShareIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addTransitionType, startTransition, useCallback } from "react";

import {
  BlueskyIcon,
  FacebookIcon,
  HackerNewsIcon,
  LinkedInIcon,
  MastodonIcon,
  RedditIcon,
  ThreadsIcon,
  WhatsAppIcon,
  XIcon,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Kbd } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { trackEvent } from "@/lib/events";
import { encodeUrlForPath } from "@/lib/url";
import { cn } from "@/lib/utils";

const buildShareItems = (url: string, text: string) => {
  const encodedUrl = encodeUrlForPath(url);
  const encodedText = encodeUrlForPath(text);

  return [
    {
      Icon: XIcon,
      label: "shareOnX" as const,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    },
    {
      Icon: LinkedInIcon,
      label: "shareOnLinkedIn" as const,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      Icon: RedditIcon,
      label: "shareOnReddit" as const,
      url: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedText}`,
    },
    {
      Icon: FacebookIcon,
      label: "shareOnFacebook" as const,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      Icon: WhatsAppIcon,
      label: "shareOnWhatsApp" as const,
      url: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    },
    {
      Icon: ThreadsIcon,
      label: "shareOnThreads" as const,
      url: `https://threads.net/intent/post?url=${encodedUrl}&text=${encodedText}`,
    },
    {
      Icon: BlueskyIcon,
      label: "shareOnBluesky" as const,
      url: `https://bsky.app/intent/compose?text=${encodedText}&url=${encodedUrl}`,
    },
    {
      Icon: HackerNewsIcon,
      label: "shareOnHackerNews" as const,
      url: `https://news.ycombinator.com/submitlink?u=${encodedUrl}&t=${encodedText}`,
    },
    {
      Icon: MastodonIcon,
      label: "shareOnMastodon" as const,
      url: `https://share.joinmastodon.org/#text=${encodedText}:${encodedUrl}`,
    },
    {
      Icon: EllipsisIcon,
      label: "shareMore" as const,
      url: "#",
    },
  ];
};

interface ProgramBottomBarLabels {
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
  shareOnThreads: string;
  shareOnBluesky: string;
  shareOnHackerNews: string;
  shareOnMastodon: string;
  shareMore: string;
}

interface ProgramBottomBarProps {
  className?: string;
  labels: ProgramBottomBarLabels;
  nextHref: string | null;
  prevHref: string | null;
  shareText: string;
  shareUrl: string;
}

export const ProgramBottomBar = ({
  className,
  labels,
  nextHref,
  prevHref,
  shareText,
  shareUrl,
}: ProgramBottomBarProps) => {
  const router = useRouter();
  const [copied, copy] = useCopyToClipboard();
  const shareItems = buildShareItems(shareUrl, shareText);

  const handleShareNative = useCallback(async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled or error
      }
    }
  }, [shareText, shareUrl]);

  const handleCopy = useCallback(async () => {
    await copy(shareUrl, 2000);
    trackEvent({ name: "copy_link", properties: { url: shareUrl } });
  }, [copy, shareUrl]);

  const handleNavigatePreviousProgram = useCallback(() => {
    if (!prevHref) {
      return;
    }
    trackEvent({ name: "navigate_previous_program" });
    startTransition(() => {
      addTransitionType("nav-back");
      router.push(prevHref);
    });
  }, [prevHref, router]);

  const handleNavigateNextProgram = useCallback(() => {
    if (!nextHref) {
      return;
    }
    trackEvent({ name: "navigate_next_program" });
    startTransition(() => {
      addTransitionType("nav-forward");
      router.push(nextHref);
    });
  }, [nextHref, router]);

  useHotkey("C", async (e) => {
    e.preventDefault();
    await handleCopy();
  });

  useHotkey("ArrowLeft", (e) => {
    e.preventDefault();
    handleNavigatePreviousProgram();
  });

  useHotkey("ArrowRight", (e) => {
    e.preventDefault();
    handleNavigateNextProgram();
  });

  return (
    <TooltipProvider delay={200}>
      <div
        className={cn(
          "bg-fd-background/95 supports-backdrop-filter:bg-fd-background/80 border-fd-border sticky bottom-0 z-20 -mx-1 border-t px-1 py-3 backdrop-blur-md",
          className,
        )}
      >
        <div className="flex justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-1">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    aria-label={labels.copyLink}
                    onClick={handleCopy}
                    size="icon-sm"
                    variant="outline"
                  >
                    {copied ? (
                      <CheckIcon className="text-green-500" />
                    ) : (
                      <LinkIcon />
                    )}
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
                          <ChevronLeftIcon />
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
                      <ChevronLeftIcon />
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
                          <ChevronRightIcon />
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
                      <ChevronRightIcon />
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
            <div className="flex flex-wrap items-center gap-1 max-sm:hidden">
              {shareItems.map((item) => {
                if (item.url === "#") {
                  return (
                    <Tooltip key={item.url}>
                      <TooltipTrigger
                        render={
                          <Button
                            aria-label={labels.shareMore}
                            onClick={handleShareNative}
                            size="icon-sm"
                            variant="ghost"
                          >
                            <span className="sr-only">{labels.shareMore}</span>
                            <item.Icon />
                          </Button>
                        }
                      />
                      <TooltipContent>{labels.shareMore}</TooltipContent>
                    </Tooltip>
                  );
                }

                return (
                  <Tooltip key={item.url}>
                    <TooltipTrigger
                      render={
                        <Button
                          aria-label={labels[item.label]}
                          nativeButton={false}
                          render={
                            <a
                              href={item.url}
                              rel="noopener noreferrer"
                              target="_blank"
                              onClick={() =>
                                // oxlint-disable-next-line react_perf/jsx-no-new-function-as-prop
                                trackEvent({
                                  name: "share_click",
                                  properties: { platform: item.label },
                                })
                              }
                            >
                              <span className="sr-only">
                                {labels[item.label]}
                              </span>
                              <item.Icon />
                            </a>
                          }
                          size="icon-sm"
                          variant="ghost"
                        />
                      }
                    />
                    <TooltipContent>{labels[item.label]}</TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center gap-1 sm:hidden">
              {shareItems.slice(0, 3).map((item) => (
                <Tooltip key={item.url}>
                  <TooltipTrigger
                    render={
                      <Button
                        aria-label={labels[item.label]}
                        nativeButton={false}
                        render={
                          <a
                            href={item.url}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            <span className="sr-only">
                              {labels[item.label]}
                            </span>
                            <item.Icon />
                          </a>
                        }
                        size="icon-sm"
                        variant="ghost"
                      />
                    }
                  />
                  <TooltipContent>{labels[item.label]}</TooltipContent>
                </Tooltip>
              ))}
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      aria-label={labels.share}
                      className="sm:hidden"
                      size="icon-sm"
                      variant="ghost"
                    >
                      <ShareIcon />
                    </Button>
                  }
                />
                <DropdownMenuContent align="end" className="w-fit">
                  {shareItems.slice(3).map((item) => {
                    if (item.url === "#") {
                      return (
                        <DropdownMenuItem
                          key={item.url}
                          // oxlint-disable-next-line react_perf/jsx-no-new-function-as-prop
                          onClick={(e) => {
                            e.preventDefault();
                            handleShareNative();
                          }}
                        >
                          <EllipsisIcon />
                          {labels.shareMore}
                        </DropdownMenuItem>
                      );
                    }

                    return (
                      <DropdownMenuItem
                        key={item.url}
                        nativeButton={false}
                        render={
                          <a
                            href={item.url}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            <item.Icon />
                            {labels[item.label]}
                          </a>
                        }
                      />
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
