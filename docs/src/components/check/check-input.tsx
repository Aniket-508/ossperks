"use client";

import { parseRepoUrl } from "@ossperks/core";
import { useForm } from "@tanstack/react-form";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { withLocalePrefix } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { CheckTranslations } from "@/locales/en/check";

interface RepoCheckInputProps {
  lang: string;
  translations: CheckTranslations["input"];
  className?: string;
  compact?: boolean;
}

export const RepoCheckInput = ({
  lang,
  translations,
  className,
  compact,
}: RepoCheckInputProps) => {
  const router = useRouter();

  const schema = useMemo(
    () =>
      z.object({
        url: z
          .string()
          .min(1, translations.required)
          .refine((val) => parseRepoUrl(val) !== null, {
            message: translations.invalidUrl,
          }),
      }),
    [translations.required, translations.invalidUrl]
  );

  const form = useForm({
    defaultValues: { url: "" },
    onSubmit: ({ value }) => {
      const ref = parseRepoUrl(value.url);
      if (!ref) {
        return;
      }
      const search = `?provider=${encodeURIComponent(ref.provider)}&owner=${encodeURIComponent(ref.owner)}&repo=${encodeURIComponent(ref.repo)}&path=${encodeURIComponent(ref.path)}`;
      router.push(`${withLocalePrefix(lang, ROUTES.CHECK)}${search}`);
    },
    validators: {
      onSubmit: schema,
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
                placeholder={translations.placeholder}
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
