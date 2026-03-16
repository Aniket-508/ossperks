"use client";

import {
  ArrowRight,
  CircleAlert,
  CircleCheck,
  CircleX,
  GitFork,
  Lock,
  Scale,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { RepoCheckInput } from "@/components/home/repo-check-input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/constants/routes";

interface RepoInfo {
  description: string | null;
  isFork: boolean;
  isPrivate: boolean;
  license: string | null;
  name: string;
  owner: string;
  provider: string;
  pushedAt: string;
  repo: string;
  stars: number;
}

interface CheckResult {
  name: string;
  perksCount: number;
  reasons: string[];
  slug: string;
  status: "eligible" | "needs-review" | "ineligible";
}

interface CheckResponse {
  repo: RepoInfo;
  results: CheckResult[];
}

const formatAge = (iso: string): string => {
  const days = Math.floor(
    (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (days === 0) {
    return "today";
  }
  if (days === 1) {
    return "yesterday";
  }
  if (days < 30) {
    return `${days}d ago`;
  }
  if (days < 365) {
    return `${Math.floor(days / 30)}mo ago`;
  }
  return `${Math.floor(days / 365)}y ago`;
};

const statusConfig = {
  eligible: {
    bg: "bg-emerald-500/10",
    color: "text-emerald-500",
    icon: CircleCheck,
    label: "Eligible",
    ring: "ring-emerald-500/20",
  },
  ineligible: {
    bg: "bg-red-500/10",
    color: "text-red-500",
    icon: CircleX,
    label: "Ineligible",
    ring: "ring-red-500/20",
  },
  "needs-review": {
    bg: "bg-amber-500/10",
    color: "text-amber-500",
    icon: CircleAlert,
    label: "Needs Review",
    ring: "ring-amber-500/20",
  },
} as const;

const CheckSkeleton = ({ owner, repo }: { owner: string; repo: string }) => (
  <div className="container max-w-4xl flex-1 flex flex-col w-full py-12 px-4 mx-auto animate-pulse">
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">
        {owner}/{repo}
      </h1>
      <div className="h-5 w-2/3 bg-fd-muted rounded mb-4" />
      <div className="flex gap-2">
        <div className="h-6 w-24 bg-fd-muted rounded-full" />
        <div className="h-6 w-16 bg-fd-muted rounded-full" />
        <div className="h-6 w-28 bg-fd-muted rounded-full" />
      </div>
    </div>
    <Separator className="mb-8" />
    <div className="grid grid-cols-3 gap-4 mb-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="text-center p-4 rounded-lg border">
          <div className="h-9 w-8 bg-fd-muted rounded mx-auto mb-2" />
          <div className="h-4 w-20 bg-fd-muted rounded mx-auto" />
        </div>
      ))}
    </div>
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="h-16 bg-fd-muted rounded-lg mb-3" />
    ))}
  </div>
);

const ResultSection = ({
  items,
  status,
}: {
  items: CheckResult[];
  status: "eligible" | "needs-review" | "ineligible";
}) => {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <section className="mb-8">
      <h2
        className={`text-lg font-semibold mb-4 flex items-center gap-2 ${config.color}`}
      >
        <Icon className="size-5" />
        {config.label} ({items.length})
      </h2>
      <div className="grid gap-3">
        {items.map((r) => (
          <Card key={r.slug} className={config.ring}>
            <CardHeader>
              <CardTitle className="text-base min-w-0 truncate">
                {r.name}
              </CardTitle>
              <CardAction>
                <Badge
                  variant="action"
                  className="text-sm"
                  render={
                    <Link href={`${ROUTES.PROGRAMS}/${r.slug}`}>
                      {r.perksCount} perks
                      <ArrowRight />
                    </Link>
                  }
                />
              </CardAction>
            </CardHeader>
            {r.reasons.length > 0 && (
              <CardContent className="pt-0">
                <ul className="space-y-1">
                  {[...new Set(r.reasons)].map((reason) => (
                    <li
                      key={`${r.slug}-${reason}`}
                      className="flex items-center text-sm text-fd-muted-foreground gap-2"
                    >
                      <span className="size-1 rounded-full bg-fd-muted-foreground/50 shrink-0" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
};

const CheckResults = ({ data }: { data: CheckResponse }) => {
  const { repo, results } = data;
  const eligible = results.filter((r) => r.status === "eligible");
  const review = results.filter((r) => r.status === "needs-review");
  const ineligible = results.filter((r) => r.status === "ineligible");

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {repo.owner}/{repo.repo}
        </h1>
        {repo.description && (
          <p className="text-fd-muted-foreground mb-4">{repo.description}</p>
        )}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="gap-1.5">
            <Star />
            {repo.stars.toLocaleString()} stars
          </Badge>
          {repo.license && (
            <Badge variant="outline" className="gap-1.5">
              <Scale />
              {repo.license}
            </Badge>
          )}
          <Badge variant="outline">Last push {formatAge(repo.pushedAt)}</Badge>
          {repo.isFork && (
            <Badge variant="secondary" className="gap-1.5">
              <GitFork />
              Fork
            </Badge>
          )}
          {repo.isPrivate && (
            <Badge variant="secondary" className="gap-1.5">
              <Lock />
              Private
            </Badge>
          )}
        </div>
      </div>

      <Separator className="mb-8" />

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          {
            color: "text-emerald-500",
            count: eligible.length,
            label: "Eligible",
          },
          {
            color: "text-amber-500",
            count: review.length,
            label: "Needs Review",
          },
          {
            color: "text-red-500",
            count: ineligible.length,
            label: "Ineligible",
          },
        ].map((s) => (
          <div key={s.label} className="text-center p-4 rounded-lg border">
            <p className={`text-3xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-sm text-fd-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {eligible.length > 0 && (
        <ResultSection items={eligible} status="eligible" />
      )}
      {review.length > 0 && (
        <ResultSection items={review} status="needs-review" />
      )}
      {ineligible.length > 0 && (
        <ResultSection items={ineligible} status="ineligible" />
      )}
    </>
  );
};

export default function CheckPage() {
  const params = useParams<{
    lang: string;
    owner: string;
    provider: string;
    repo: string;
  }>();
  const [data, setData] = useState<CheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/check?owner=${encodeURIComponent(params.owner)}&repo=${encodeURIComponent(params.repo)}&provider=${encodeURIComponent(params.provider)}`
        );
        const json = await res.json();
        if (!res.ok) {
          setError(json.error ?? `Error ${res.status}`);
          return;
        }
        setData(json as CheckResponse);
      } catch {
        setError("Failed to fetch eligibility results. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [params.owner, params.repo, params.provider]);

  if (loading) {
    return <CheckSkeleton owner={params.owner} repo={params.repo} />;
  }

  if (error) {
    return (
      <div className="container max-w-4xl flex-1 flex flex-col w-full py-12 px-4 mx-auto">
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-8 text-center">
          <CircleX className="mx-auto mb-4 size-10 text-red-500" />
          <h1 className="text-xl font-semibold mb-2">Check Failed</h1>
          <p className="text-fd-muted-foreground mb-6">{error}</p>
          <RepoCheckInput lang={params.lang} />
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="container max-w-4xl flex-1 flex flex-col w-full py-12 px-4 mx-auto">
      <CheckResults data={data} />

      <Separator className="mb-8" />

      <section className="text-center">
        <h2 className="text-lg font-semibold mb-4">Check another repository</h2>
        <RepoCheckInput lang={params.lang} />
      </section>
    </div>
  );
}
