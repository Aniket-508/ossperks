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
      <Card className="hover:bg-fd-accent h-full transition-colors">
        <CardHeader>
          <Badge variant="default" className="w-fit text-xs">
            {categoryLabel}
          </Badge>
          <CardTitle className="group-hover:text-fd-primary mt-2 font-semibold">
            {program.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3">
          <p className="text-fd-muted-foreground line-clamp-2 text-sm">
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
          <div className="mt-auto flex justify-end">
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
