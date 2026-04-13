"use client";

import { useQueryStates } from "nuqs";
import { useCallback, useMemo, useTransition } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getPaginationWindow } from "@/lib/pagination-window";
import { tagsBrowsePaginationParams } from "@/lib/search-params";

const PageJump = ({
  displayPage,
  n,
  onGoPage,
}: {
  displayPage: number;
  n: number;
  onGoPage: (p: number) => void;
}) => {
  const onClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      onGoPage(n);
    },
    [n, onGoPage],
  );

  return (
    <PaginationItem>
      <PaginationLink
        aria-label={`Page ${n}`}
        href="#"
        isActive={n === displayPage}
        onClick={onClick}
      >
        {n}
      </PaginationLink>
    </PaginationItem>
  );
};

export interface ListingPaginationLabels {
  next: string;
  previous: string;
}

export type ListingPaginationParsers = typeof tagsBrowsePaginationParams;

export interface ListingPaginationProps {
  labels: ListingPaginationLabels;
  pageCount: number;
  parsers?: ListingPaginationParsers;
  shallow?: boolean;
}

export const ListingPagination = ({
  labels,
  pageCount,
  parsers = tagsBrowsePaginationParams,
  shallow = false,
}: ListingPaginationProps) => {
  const [, startTransition] = useTransition();
  const [{ page: urlPage }, setParams] = useQueryStates(parsers, {
    shallow,
    startTransition,
  });

  const displayPage = urlPage ?? 1;

  const goPage = useCallback(
    async (next: number) => {
      await setParams({ page: next });
    },
    [setParams],
  );

  const handlePagePrev = useCallback(
    async (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      await goPage(displayPage - 1);
    },
    [displayPage, goPage],
  );

  const handlePageNext = useCallback(
    async (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      await goPage(displayPage + 1);
    },
    [displayPage, goPage],
  );

  const windowEntries = useMemo(
    () => getPaginationWindow(displayPage, pageCount),
    [displayPage, pageCount],
  );

  if (pageCount <= 1) {
    return null;
  }

  return (
    <Pagination className="mt-10 w-full">
      <div className="flex w-full items-center gap-2">
        <div className="flex min-w-0 flex-1 justify-start">
          <PaginationPrevious
            aria-disabled={displayPage <= 1}
            className={
              displayPage <= 1 ? "pointer-events-none opacity-50" : undefined
            }
            href={displayPage <= 1 ? undefined : "#"}
            onClick={displayPage <= 1 ? undefined : handlePagePrev}
            tabIndex={displayPage <= 1 ? -1 : undefined}
            text={labels.previous}
          />
        </div>
        <PaginationContent className="mx-auto flex max-w-full flex-wrap justify-center gap-1">
          {windowEntries.map((entry) =>
            entry.type === "ellipsis" ? (
              <PaginationItem key={entry.key}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PageJump
                displayPage={displayPage}
                key={entry.key}
                n={entry.page}
                onGoPage={goPage}
              />
            ),
          )}
        </PaginationContent>
        <div className="flex min-w-0 flex-1 justify-end">
          <PaginationNext
            aria-disabled={displayPage >= pageCount}
            className={
              displayPage >= pageCount
                ? "pointer-events-none opacity-50"
                : undefined
            }
            href={displayPage >= pageCount ? undefined : "#"}
            onClick={displayPage >= pageCount ? undefined : handlePageNext}
            tabIndex={displayPage >= pageCount ? -1 : undefined}
            text={labels.next}
          />
        </div>
      </div>
    </Pagination>
  );
};
