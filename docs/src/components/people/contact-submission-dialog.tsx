"use client";

import { useForm } from "@tanstack/react-form";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";
import { z } from "zod";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSubmission } from "@/hooks/use-submission";

interface FormField {
  state: {
    value: string;
    meta: { errors: unknown[] };
  };
  handleChange: (value: string) => void;
  handleBlur: () => void;
}

const FieldError = ({ errors }: { errors: unknown[] }) => {
  if (errors.length === 0) {
    return null;
  }
  const message =
    typeof errors[0] === "string"
      ? errors[0]
      : (errors[0] as { message?: string })?.message;
  if (!message) {
    return null;
  }
  return <p className="text-xs text-destructive">{message}</p>;
};

const TextField = ({
  field,
  id,
  label,
  placeholder,
  disabled,
  type = "text",
}: {
  field: FormField;
  id: string;
  label: string;
  placeholder: string;
  disabled: boolean;
  type?: string;
}) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      field.handleChange(e.target.value),
    [field]
  );

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={field.state.value}
        onChange={handleChange}
        onBlur={field.handleBlur}
        disabled={disabled}
      />
      <FieldError errors={field.state.meta.errors} />
    </div>
  );
};

const canSubmitSelector = (s: { canSubmit: boolean }) => s.canSubmit;

interface ContactSubmissionTranslations {
  heading: string;
  description: string;
  buttonText: string;
  form: {
    nameLabel: string;
    namePlaceholder: string;
    roleLabel: string;
    rolePlaceholder: string;
    urlLabel: string;
    urlPlaceholder: string;
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
        url: z.string().url(t.validation.invalidUrl).or(z.literal("")),
      }),
    [t.validation]
  );

  const { isSubmitting, submissionError, submissionStatus, submit } =
    useSubmission("/api/submit-contact", {
      error: t.submitError,
      submitting: t.submitting,
    });

  const form = useForm({
    defaultValues: {
      name: "",
      programSlug: "",
      role: "",
      url: "",
    },
    onSubmit: async ({ value }) => {
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
    [handleClose]
  );

  const handleFormSubmit = useCallback(
    (e: React.SubmitEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        {step === "form" ? (
          <form
            id="contact-form"
            onSubmit={handleFormSubmit}
            className="contents"
          >
            <DialogHeader>
              <DialogTitle>{t.heading}</DialogTitle>
              <DialogDescription>{t.description}</DialogDescription>
            </DialogHeader>

            <DialogBody>
              {/* eslint-disable react-perf/jsx-no-new-function-as-prop */}
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <form.Field name="name">
                    {(field) => (
                      <TextField
                        field={field}
                        id="contact-name"
                        label={t.form.nameLabel}
                        placeholder={t.form.namePlaceholder}
                        disabled={isSubmitting}
                      />
                    )}
                  </form.Field>
                  <form.Field name="role">
                    {(field) => (
                      <TextField
                        field={field}
                        id="contact-role"
                        label={t.form.roleLabel}
                        placeholder={t.form.rolePlaceholder}
                        disabled={isSubmitting}
                      />
                    )}
                  </form.Field>
                </div>

                <form.Field name="url">
                  {(field) => (
                    <TextField
                      field={field}
                      id="contact-url"
                      label={t.form.urlLabel}
                      placeholder={t.form.urlPlaceholder}
                      type="url"
                      disabled={isSubmitting}
                    />
                  )}
                </form.Field>

                <form.Field name="programSlug">
                  {(field) => {
                    const handleChange = (val: string | number | null) =>
                      field.handleChange(val as string);
                    return (
                      <div className="space-y-2">
                        <Label>{t.form.programLabel}</Label>
                        <Select
                          value={field.state.value}
                          onValueChange={handleChange}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={t.form.programPlaceholder}
                            />
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
                  <p className="text-sm text-destructive">{submissionError}</p>
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
                        {submissionStatus}
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
        ) : (
          <div className="flex flex-col items-center gap-4 text-center">
            <CheckCircle2 className="size-12 text-green-500" />
            <div>
              <h3 className="text-lg font-semibold">{t.success.heading}</h3>
              <p className="text-sm text-fd-muted-foreground">
                {t.success.message}
              </p>
            </div>
            {result && (
              <div className="flex flex-col gap-3 w-full">
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
                        String(result.prNumber)
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
