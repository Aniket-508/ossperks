import type { Program } from "@ossperks/core";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface ProgramCardProps {
  program: Program;
  programHref: string;
  categoryLabel: string;
  learnMore: string;
  more: string;
}

export const ProgramCard = ({
  program,
  programHref,
  categoryLabel,
  learnMore,
  more,
}: ProgramCardProps) => {
  const extraPerks = program.perks.length - 2;

  return (
    <Link href={programHref} className="group block">
      <Card className="h-full transition-colors hover:bg-fd-accent">
        <CardHeader>
          <Badge variant="default" className="w-fit text-xs">
            {categoryLabel}
          </Badge>
          <CardTitle className="font-semibold group-hover:text-fd-primary mt-2">
            {program.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-fd-muted-foreground line-clamp-2">
            {program.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {program.perks.slice(0, 2).map((perk) => (
              <Badge key={perk.title} variant="outline">
                {perk.title}
              </Badge>
            ))}
            {extraPerks > 0 && (
              <Badge variant="secondary">
                {more.replace("{count}", String(extraPerks))}
              </Badge>
            )}
          </div>
          <div className="flex justify-end">
            <Badge variant="action" className="group-hover:underline">
              {learnMore}
              <ArrowRight className="size-3" />
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
