"use client";

import { useCallback, useState } from "react";

export interface SubmissionResult {
  success: boolean;
  prNumber?: number;
  prUrl?: string;
  error?: string;
}

export const useSubmission = (endpoint: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

  const submit = useCallback(
    async (data: Record<string, unknown>): Promise<SubmissionResult> => {
      setIsSubmitting(true);
      setSubmissionError(null);
      setSubmissionStatus("Submitting...");

      try {
        const response = await fetch(endpoint, {
          body: JSON.stringify(data),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to submit");
        }

        return {
          prNumber: result.prNumber,
          prUrl: result.prUrl,
          success: true,
        };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to submit";
        setSubmissionError(message);
        return { error: message, success: false };
      } finally {
        setIsSubmitting(false);
        setSubmissionStatus(null);
      }
    },
    [endpoint]
  );

  return { isSubmitting, submissionError, submissionStatus, submit };
};
