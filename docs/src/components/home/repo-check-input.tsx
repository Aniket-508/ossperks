"use client";

import { parseRepoUrl } from "@ossperks/core";
import { useForm } from "@tanstack/react-form";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { withLocalePrefix } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const repoUrlSchema = z.object({
  url: z
    .string()
    .min(1, "Paste a repository URL")
    .refine((val) => parseRepoUrl(val) !== null, {
      message: "Please enter a valid GitHub or GitLab repository URL",
    }),
});

interface RepoCheckInputProps {
  lang: string;
  className?: string;
  compact?: boolean;
}

export const RepoCheckInput = ({
  lang,
  className,
  compact,
}: RepoCheckInputProps) => {
  const router = useRouter();

  const form = useForm({
    defaultValues: { url: "" },
    onSubmit: ({ value }) => {
      const ref = parseRepoUrl(value.url);
      if (!ref) {
        return;
      }
      const path =
        `${ROUTES.CHECK}/${ref.provider}/${ref.owner}/${ref.repo}` as `/${string}`;
      router.push(withLocalePrefix(lang, path));
    },
    validators: {
      onSubmit: repoUrlSchema,
    },
  });

  const handleFormSubmit = useCallback(
    (e: React.SubmitEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  return (
    <form
      onSubmit={handleFormSubmit}
      className={cn("w-full max-w-xl mx-auto", className)}
    >
      {/* eslint-disable react-perf/jsx-no-new-function-as-prop -- TanStack Form render prop */}
      <form.Field name="url">
        {(field) => (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-fd-muted-foreground pointer-events-none" />
              <Input
                type="text"
                inputSize={compact ? "default" : "lg"}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="Paste a GitHub or GitLab repo URL..."
                aria-invalid={field.state.meta.errors.length > 0}
                className="pl-10"
              />
            </div>
            {field.state.meta.errors.length > 0 && (
              <p className="mt-2 text-xs text-destructive">
                {typeof field.state.meta.errors[0] === "string"
                  ? field.state.meta.errors[0]
                  : (field.state.meta.errors[0] as { message?: string })
                      ?.message}
              </p>
            )}
          </>
        )}
      </form.Field>
      {/* eslint-enable react-perf/jsx-no-new-function-as-prop */}
    </form>
  );
};
