"use client";

import { getProgramBySlug } from "@ossperks/core";
import { useForm } from "@tanstack/react-form";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";
import { z } from "zod";

import { ContactFields } from "@/components/people/contact-fields";
import type { ContactFieldsTranslations } from "@/components/people/contact-fields";
import { AutofillCard } from "@/components/shared/autofill-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldError } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSubmission } from "@/hooks/use-submission";
import { trackEvent } from "@/lib/events";
import { canSubmitSelector } from "@/lib/utils";

interface ContactSubmissionTranslations {
  autofill: {
    button: string;
    description: string;
    error: string;
    heading: string;
    loading: string;
    placeholder: string;
    success: string;
  };
  heading: string;
  description: string;
  buttonText: string;
  form: ContactFieldsTranslations & {
    programLabel: string;
    programPlaceholder: string;
  };
  validation: {
    nameRequired: string;
    programRequired: string;
    roleRequired: string;
    invalidUrl: string;
  };
  submitButton: string;
  submitting: string;
  submitError: string;
  success: {
    heading: string;
    message: string;
    viewPr: string;
    close: string;
  };
}

interface ContactSubmissionDialogProps {
  programs: { slug: string; name: string }[];
  trigger?: React.ReactElement;
  translations: ContactSubmissionTranslations;
}

export const ContactSubmissionDialog = ({
  programs,
  trigger,
  translations,
}: ContactSubmissionDialogProps) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"form" | "success">("form");
  const [result, setResult] = useState<{
    prNumber?: number;
    prUrl?: string;
  } | null>(null);
  const t = translations;

  const contactSchema = useMemo(
    () =>
      z.object({
        name: z.string().min(1, t.validation.nameRequired),
        programSlug: z.string().min(1, t.validation.programRequired),
        role: z.string().min(1, t.validation.roleRequired),
        url: z.url(t.validation.invalidUrl).or(z.literal("")),
      }),
    [t.validation],
  );

  const { isSubmitting, submissionError, submit } = useSubmission(
    "/api/submit-contact",
    {
      error: t.submitError,
      submitting: t.submitting,
    },
  );

  const form = useForm({
    defaultValues: {
      name: "",
      programSlug: "",
      role: "",
      url: "",
    },
    onSubmit: async ({ value }) => {
      trackEvent({
        name: "submit_contact",
        properties: {
          name: value.name,
          ...(value.url ? { url: value.url } : {}),
        },
      });
      const payload: Record<string, unknown> = {
        name: value.name,
        programSlug: value.programSlug,
        role: value.role,
      };
      if (value.url) {
        payload.url = value.url;
      }

      const res = await submit(payload);
      if (res.success) {
        setResult({ prNumber: res.prNumber, prUrl: res.prUrl });
        setStep("success");
      }
    },
    validators: {
      onChange: contactSchema,
    },
  });

  const handleAutofillData = useCallback(
    (data: Record<string, unknown>, sourceUrl: string) => {
      const d = data;
      if (typeof d.name === "string") {
        form.setFieldValue("name", d.name);
      }
      if (typeof d.role === "string") {
        form.setFieldValue("role", d.role);
      }
      form.setFieldValue("url", sourceUrl);
    },
    [form],
  );

  const handleClose = useCallback(() => {
    setOpen(false);
    setTimeout(() => {
      setStep("form");
      form.reset();
      setResult(null);
    }, 300);
  }, [form]);

  const handleOpenChange = useCallback(
    (val: boolean) => (val ? setOpen(true) : handleClose()),
    [handleClose],
  );

  const handleFormSubmit = useCallback(
    (e: React.SubmitEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form],
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        {step === "form" ? (
          <>
            <DialogHeader>
              <DialogTitle>{t.heading}</DialogTitle>
              <DialogDescription>{t.description}</DialogDescription>
            </DialogHeader>

            <AutofillCard
              endpoint="/api/autofill-contact"
              translations={t.autofill}
              disabled={isSubmitting}
              onAutofill={handleAutofillData}
            />

            <form
              id="contact-form"
              onSubmit={handleFormSubmit}
              className="contents"
            >
              <DialogBody className="pt-0">
                {/* eslint-disable react-perf/jsx-no-new-function-as-prop */}
                <div className="grid gap-4">
                  <form.Field name="name">
                    {(nameField) => (
                      <form.Field name="role">
                        {(roleField) => (
                          <form.Field name="url">
                            {(urlField) => (
                              <ContactFields
                                nameField={nameField}
                                roleField={roleField}
                                urlField={urlField}
                                translations={t.form}
                                disabled={isSubmitting}
                              />
                            )}
                          </form.Field>
                        )}
                      </form.Field>
                    )}
                  </form.Field>

                  <form.Field name="programSlug">
                    {(field) => {
                      const handleChange = (val: string | number | null) =>
                        field.handleChange(val as string);
                      return (
                        <div className="space-y-2">
                          <Label htmlFor="program-slug">
                            {t.form.programLabel}
                          </Label>
                          <Select
                            value={field.state.value}
                            onValueChange={handleChange}
                            disabled={isSubmitting}
                          >
                            <SelectTrigger className="w-full" id="program-slug">
                              <SelectValue
                                placeholder={t.form.programPlaceholder}
                              >
                                {getProgramBySlug(field.state.value)?.name}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {programs.map((p) => (
                                <SelectItem key={p.slug} value={p.slug}>
                                  {p.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FieldError errors={field.state.meta.errors} />
                        </div>
                      );
                    }}
                  </form.Field>

                  {submissionError && (
                    <p className="text-destructive text-sm" role="alert">
                      {submissionError}
                    </p>
                  )}
                </div>
                {/* eslint-enable react-perf/jsx-no-new-function-as-prop */}
              </DialogBody>

              <DialogFooter>
                <form.Subscribe selector={canSubmitSelector}>
                  {(canSubmit) => (
                    <Button
                      type="submit"
                      disabled={!canSubmit || isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin" />
                          {t.submitting}
                        </>
                      ) : (
                        <>
                          {t.submitButton}
                          <ArrowRight />
                        </>
                      )}
                    </Button>
                  )}
                </form.Subscribe>
              </DialogFooter>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center">
            <CheckCircle2 className="size-12 text-green-500" />
            <div>
              <h3 className="text-lg font-semibold">{t.success.heading}</h3>
              <p className="text-fd-muted-foreground text-sm">
                {t.success.message}
              </p>
            </div>
            {result && (
              <div className="flex w-full flex-col gap-3">
                <Button
                  variant="outline"
                  nativeButton={false}
                  render={
                    <a
                      href={result.prUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t.success.viewPr.replace(
                        "{prNumber}",
                        String(result.prNumber),
                      )}
                      <ArrowRight />
                    </a>
                  }
                />
                <Button onClick={handleClose} className="w-full">
                  {t.success.close}
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
