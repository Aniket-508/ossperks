"use client";

import { useForm } from "@tanstack/react-form";
import { Loader2, Sparkles } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import useSWRMutation from "swr/mutation";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { postJson } from "@/lib/fetchers";
import { canSubmitSelector, cn } from "@/lib/utils";

interface AutofillCardProps {
  className?: string;
  disabled?: boolean;
  endpoint: string;
  onAutofill: (data: Record<string, unknown>, sourceUrl: string) => void;
  translations: {
    button: string;
    description: string;
    error: string;
    heading: string;
    loading: string;
    placeholder: string;
    success: string;
  };
}

export const AutofillCard = ({
  className,
  disabled = false,
  endpoint,
  onAutofill,
  translations: t,
}: AutofillCardProps) => {
  const [showSuccess, setShowSuccess] = useState(false);

  const urlSchema = useMemo(() => z.object({ url: z.url(t.error) }), [t.error]);

  const { error, isMutating, trigger } = useSWRMutation<
    Record<string, unknown>,
    Error,
    string,
    string
  >(endpoint, (_key, { arg }) => postJson(_key, { url: arg }, t.error));

  const form = useForm({
    defaultValues: { url: "" },
    onSubmit: async ({ value }) => {
      setShowSuccess(false);
      try {
        const data = await trigger(value.url.trim());
        onAutofill(data, value.url.trim());
        setShowSuccess(true);
      } catch {
        /* error surfaced via SWR's error state */
      }
    },
    validators: { onSubmit: urlSchema },
  });

  const handleFormSubmit = useCallback(
    (e: React.SubmitEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form],
  );

  const autofillError = error instanceof Error ? error.message : null;

  return (
    <div className={cn(className)}>
      <form
        onSubmit={handleFormSubmit}
        className="from-fd-muted/60 to-fd-muted/10 border-fd-border rounded-lg border bg-linear-to-b p-4"
      >
        <div className="mb-3">
          <p className="text-sm font-semibold">{t.heading}</p>
          <p className="text-fd-muted-foreground text-xs">{t.description}</p>
        </div>
        {/* eslint-disable react-perf/jsx-no-new-function-as-prop */}
        <div className="flex flex-col items-start gap-3 sm:flex-row">
          <form.Field name="url">
            {(field) => (
              <div className="w-full">
                <Input
                  type="url"
                  required
                  placeholder={t.placeholder}
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    setShowSuccess(false);
                  }}
                  onBlur={field.handleBlur}
                  disabled={isMutating || disabled}
                  className="bg-fd-background"
                />
                <FieldError errors={field.state.meta.errors} />
              </div>
            )}
          </form.Field>
          <form.Subscribe selector={canSubmitSelector}>
            {(canSubmit) => (
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isMutating || disabled || !canSubmit}
              >
                {isMutating ? (
                  <>
                    <Loader2 className="animate-spin" />
                    {t.loading}
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    {t.button}
                  </>
                )}
              </Button>
            )}
          </form.Subscribe>
        </div>
        {/* eslint-enable react-perf/jsx-no-new-function-as-prop */}
      </form>
      {showSuccess && (
        <p className="animate-slide-down bg-fd-muted/50 overflow-hidden py-2 text-center text-xs text-green-500">
          {t.success} 🥳
        </p>
      )}
      {autofillError && (
        <p className="animate-slide-down bg-fd-muted/50 text-destructive overflow-hidden py-2 text-center text-xs">
          {autofillError} 😕
        </p>
      )}
    </div>
  );
};
