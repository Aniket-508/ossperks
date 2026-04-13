"use client";

import type { TagWithProgramCount } from "@ossperks/core";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useQueryStates } from "nuqs";
import { useMemo, useTransition } from "react";

import { ListingPagination } from "@/components/shared/listing-pagination";
import { ROUTES } from "@/constants/routes";
import { withLocalePrefix } from "@/i18n/navigation";
import { tagsBrowseSearchParams } from "@/lib/search-params";
import type { TagsBrowseSort } from "@/lib/tags-filter";
import { filterSortPaginateTags } from "@/lib/tags-filter";
import { encodeUrlForPath } from "@/lib/url";
import { cn } from "@/lib/utils";

interface TagsBrowseListingProps {
  allTags: TagWithProgramCount[];
  labels: {
    noMatches: string;
    paginationNext: string;
    paginationPrevious: string;
    programsCount: string;
  };
  lang: string;
}

export const TagsBrowseListing = ({
  allTags,
  labels,
  lang,
}: TagsBrowseListingProps) => {
  const [isPending, startTransition] = useTransition();
  const [{ q, sort, letter, page }] = useQueryStates(tagsBrowseSearchParams, {
    shallow: true,
    startTransition,
  });

  const { rows, pageCount } = useMemo(
    () =>
      filterSortPaginateTags(allTags, {
        letter,
        page,
        q,
        sort: (sort ?? null) as TagsBrowseSort | null,
      }),
    [allTags, q, sort, letter, page],
  );

  return (
    <>
      {rows.length > 0 ? (
        <div
          className={cn(
            "grid gap-3 transition-opacity md:grid-cols-3",
            isPending && "pointer-events-none opacity-60",
          )}
        >
          {rows.map((row) => {
            const href = withLocalePrefix(
              lang,
              `${ROUTES.TAGS}/${encodeUrlForPath(row.tag)}` as `/${string}`,
            );
            return (
              <Link
                className="border-fd-border/60 hover:bg-fd-muted/40 flex items-center justify-between gap-3 rounded-lg border px-4 py-3 transition-colors"
                href={href}
                key={row.tag}
                transitionTypes={["nav-forward"]}
              >
                <div className="min-w-0">
                  <div className="truncate font-medium">{row.tag}</div>
                  <div className="text-fd-muted-foreground text-sm">
                    {labels.programsCount.replace("{count}", String(row.count))}
                  </div>
                </div>
                <ChevronRight className="text-fd-muted-foreground size-4 shrink-0" />
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="bg-fd-muted/30 rounded-lg border border-dashed p-12 text-center">
          <p className="text-fd-muted-foreground">{labels.noMatches}</p>
        </div>
      )}

      <ListingPagination
        labels={{
          next: labels.paginationNext,
          previous: labels.paginationPrevious,
        }}
        pageCount={pageCount}
        shallow
      />
    </>
  );
};
