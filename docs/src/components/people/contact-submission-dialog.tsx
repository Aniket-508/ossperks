"use client";

import { useForm } from "@tanstack/react-form";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import React, { useCallback, useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  programSlug: z.string().min(1, "Program is required"),
  role: z.string().min(1, "Role is required"),
  url: z.string().url("Must be a valid URL").or(z.literal("")),
});

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

const ProgramSelectField = ({
  field,
  programs,
  disabled,
}: {
  field: FormField;
  programs: { slug: string; name: string }[];
  disabled: boolean;
}) => {
  const handleChange = useCallback(
    (val: string | number | null) => field.handleChange(val as string),
    [field]
  );

  return (
    <div className="space-y-2">
      <Label>Program</Label>
      <Select
        value={field.state.value}
        onValueChange={handleChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a program" />
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
};

const canSubmitSelector = (s: { canSubmit: boolean }) => s.canSubmit;

interface ContactSubmissionDialogProps {
  programs: { slug: string; name: string }[];
  trigger?: React.ReactElement;
  translations: {
    heading: string;
    description: string;
    buttonText: string;
  };
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

  const { isSubmitting, submissionError, submissionStatus, submit } =
    useSubmission("/api/submit-contact");

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
          <>
            <DialogHeader>
              <DialogTitle>{translations.heading}</DialogTitle>
              <DialogDescription>{translations.description}</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleFormSubmit} className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <form.Field name="name">
                  {(field) => (
                    <TextField
                      field={field}
                      id="contact-name"
                      label="Name"
                      placeholder="e.g., Jane Doe"
                      disabled={isSubmitting}
                    />
                  )}
                </form.Field>
                <form.Field name="role">
                  {(field) => (
                    <TextField
                      field={field}
                      id="contact-role"
                      label="Role"
                      placeholder="e.g., OSS Program Manager"
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
                    label="URL (optional)"
                    placeholder="https://..."
                    type="url"
                    disabled={isSubmitting}
                  />
                )}
              </form.Field>

              <form.Field name="programSlug">
                {(field) => (
                  <ProgramSelectField
                    field={field}
                    programs={programs}
                    disabled={isSubmitting}
                  />
                )}
              </form.Field>

              {submissionError && (
                <p className="text-sm text-destructive">{submissionError}</p>
              )}

              <form.Subscribe selector={canSubmitSelector}>
                {(canSubmit) => (
                  <Button
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        {submissionStatus}
                      </>
                    ) : (
                      <>
                        Submit PR
                        <ArrowRight className="size-4" />
                      </>
                    )}
                  </Button>
                )}
              </form.Subscribe>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center">
            <CheckCircle2 className="size-12 text-green-500" />
            <div>
              <h3 className="text-lg font-semibold">PR Created!</h3>
              <p className="text-sm text-fd-muted-foreground">
                Your pull request has been created and will be reviewed.
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
                      View PR #{result.prNumber}
                      <ArrowRight className="size-4" />
                    </a>
                  }
                />
                <Button onClick={handleClose} className="w-full">
                  Close
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
