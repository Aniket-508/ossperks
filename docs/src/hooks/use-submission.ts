"use client";

import { useCallback } from "react";
import useSWRMutation from "swr/mutation";

import { postJson } from "@/lib/fetchers";

export interface SubmissionResult {
  success: boolean;
  prNumber?: number;
  prUrl?: string;
  error?: string;
}

interface SubmissionLabels {
  submitting: string;
  error: string;
}

const defaultLabels: SubmissionLabels = {
  error: "Failed to submit",
  submitting: "Submitting...",
};

export const useSubmission = (
  endpoint: string,
  labels: SubmissionLabels = defaultLabels,
) => {
  const { error, isMutating, trigger } = useSWRMutation<
    { error?: string; prNumber?: number; prUrl?: string },
    Error,
    string,
    Record<string, unknown>
  >(endpoint, (_key, { arg }) => postJson(_key, arg, labels.error));

  const submit = useCallback(
    async (data: Record<string, unknown>): Promise<SubmissionResult> => {
      try {
        const result = await trigger(data);
        return {
          prNumber: result.prNumber,
          prUrl: result.prUrl,
          success: true,
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : labels.error;
        return { error: message, success: false };
      }
    },
    [trigger, labels.error],
  );

  const submissionError = error instanceof Error ? error.message : null;

  return { isSubmitting: isMutating, submissionError, submit };
};
