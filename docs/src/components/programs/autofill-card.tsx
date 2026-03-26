"use client";

import { Loader2, Sparkles } from "lucide-react";
import { useCallback, useState } from "react";
import useSWRMutation from "swr/mutation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { postJson } from "@/lib/fetchers";
import { cn } from "@/lib/utils";

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
  const [url, setUrl] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const { error, isMutating, trigger } = useSWRMutation<
    Record<string, unknown>,
    Error,
    string,
    string
  >(endpoint, (_key, { arg }) => postJson(_key, { url: arg }, t.error));

  const handleAutofill = useCallback(async () => {
    if (!url.trim() || disabled) {
      return;
    }

    setShowSuccess(false);
    try {
      const data = await trigger(url.trim());
      onAutofill(data, url.trim());
      setShowSuccess(true);
    } catch {
      /* error surfaced via SWR's error state */
    }
  }, [url, disabled, trigger, onAutofill]);

  const handleUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUrl(e.target.value);
      setShowSuccess(false);
    },
    [],
  );

  const autofillError = error instanceof Error ? error.message : null;

  return (
    <div className={cn(className)}>
      <div className="from-fd-muted/60 to-fd-muted/10 border-fd-border rounded-lg border bg-linear-to-b p-4">
        <div className="mb-3">
          <p className="text-sm font-semibold">{t.heading}</p>
          <p className="text-fd-muted-foreground text-xs">{t.description}</p>
        </div>
        <div className="flex items-start gap-3">
          <Input
            type="url"
            placeholder={t.placeholder}
            value={url}
            onChange={handleUrlChange}
            disabled={isMutating || disabled}
            className="bg-fd-background flex-1"
          />
          <Button
            type="button"
            disabled={isMutating || disabled || !url.trim()}
            onClick={handleAutofill}
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
        </div>
        {autofillError && (
          <p className="text-destructive mt-2 text-xs">{autofillError}</p>
        )}
      </div>
      {showSuccess && (
        <p className="animate-slide-down bg-fd-muted/50 overflow-hidden py-2 text-center text-xs text-green-500">
          {t.success} 🥳
        </p>
      )}
    </div>
  );
};
