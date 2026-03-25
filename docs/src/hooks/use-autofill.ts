"use client";

import { useCallback, useState } from "react";

interface AutofillLabels {
  loading: string;
  error: string;
}

const defaultLabels: AutofillLabels = {
  error: "Could not extract details from this URL.",
  loading: "Autofilling...",
};

export const useAutofill = <T = Record<string, unknown>>(
  endpoint: string,
  labels: AutofillLabels = defaultLabels,
) => {
  const [isAutofilling, setIsAutofilling] = useState(false);
  const [autofillError, setAutofillError] = useState<string | null>(null);
  const [autofillStatus, setAutofillStatus] = useState<string | null>(null);

  const autofill = useCallback(
    async (url: string): Promise<T | null> => {
      setIsAutofilling(true);
      setAutofillError(null);
      setAutofillStatus(labels.loading);

      try {
        const response = await fetch(endpoint, {
          body: JSON.stringify({ url }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || labels.error);
        }

        return result as T;
      } catch (error) {
        const message = error instanceof Error ? error.message : labels.error;
        setAutofillError(message);
        return null;
      } finally {
        setIsAutofilling(false);
        setAutofillStatus(null);
      }
    },
    [endpoint, labels],
  );

  return { autofill, autofillError, autofillStatus, isAutofilling };
};
