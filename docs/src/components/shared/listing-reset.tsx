"use client";

import { Button } from "@/components/ui/button";

export const ListingReset = ({
  hasActiveFilters,
  label,
  onReset,
}: {
  hasActiveFilters: boolean;
  label: string;
  onReset: () => void | Promise<void>;
}) => {
  if (!hasActiveFilters) {
    return null;
  }

  return (
    <Button
      className="shrink-0"
      onClick={onReset}
      size="default"
      type="button"
      variant="outline"
    >
      {label}
    </Button>
  );
};
