"use client";

import { useForm } from "@tanstack/react-form";
import { ArrowRight, CheckCircle2, Loader2, Plus } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { useSubmission } from "@/hooks/use-submission";

const CATEGORIES = [
  { label: "AI & Machine Learning", value: "ai" },
  { label: "Analytics", value: "analytics" },
  { label: "CI/CD", value: "ci-cd" },
  { label: "Communication", value: "communication" },
  { label: "Credentials & Secrets", value: "credentials" },
  { label: "Developer Tools", value: "devtools" },
  { label: "Hosting & Deployment", value: "hosting" },
  { label: "Infrastructure", value: "infrastructure" },
  { label: "Monitoring & Observability", value: "monitoring" },
  { label: "Security", value: "security" },
  { label: "Testing", value: "testing" },
];

const programSchema = z.object({
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  name: z.string().min(1, "Program name is required"),
  perkDescription: z.string().min(1, "Perk description is required"),
  perkTitle: z.string().min(1, "Perk title is required"),
  provider: z.string().min(1, "Provider is required"),
  url: z.string().url("Must be a valid URL"),
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

const TextareaField = ({
  field,
  id,
  label,
  placeholder,
  disabled,
}: {
  field: FormField;
  id: string;
  label: string;
  placeholder: string;
  disabled: boolean;
}) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) =>
      field.handleChange(e.target.value),
    [field]
  );

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
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

const CategoryField = ({
  field,
  disabled,
}: {
  field: FormField;
  disabled: boolean;
}) => {
  const handleChange = useCallback(
    (val: string | number | null) => field.handleChange(val as string),
    [field]
  );

  return (
    <div className="space-y-2">
      <Label>Category</Label>
      <Select
        value={field.state.value}
        onValueChange={handleChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {CATEGORIES.map((cat) => (
            <SelectItem key={cat.value} value={cat.value}>
              {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldError errors={field.state.meta.errors} />
    </div>
  );
};

const canSubmitSelector = (s: { canSubmit: boolean }) => s.canSubmit;

interface ProgramSubmissionDialogProps {
  trigger?: React.ReactNode;
  translations: {
    heading: string;
    description: string;
    buttonText: string;
  };
}

export const ProgramSubmissionDialog = ({
  trigger,
  translations,
}: ProgramSubmissionDialogProps) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"form" | "success">("form");
  const [result, setResult] = useState<{
    prNumber?: number;
    prUrl?: string;
  } | null>(null);

  const { isSubmitting, submissionError, submissionStatus, submit } =
    useSubmission("/api/submit-program");

  const form = useForm({
    defaultValues: {
      category: "",
      description: "",
      name: "",
      perkDescription: "",
      perkTitle: "",
      provider: "",
      url: "",
    },
    onSubmit: async ({ value }) => {
      const res = await submit({ ...value });
      if (res.success) {
        setResult({ prNumber: res.prNumber, prUrl: res.prUrl });
        setStep("success");
      }
    },
    validators: {
      onChange: programSchema,
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
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button size="lg" />}>
        {trigger ?? (
          <>
            <Plus className="size-4" />
            {translations.buttonText}
          </>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
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
                      id="prog-name"
                      label="Program name"
                      placeholder="e.g., Vercel"
                      disabled={isSubmitting}
                    />
                  )}
                </form.Field>
                <form.Field name="provider">
                  {(field) => (
                    <TextField
                      field={field}
                      id="prog-provider"
                      label="Provider"
                      placeholder="e.g., Vercel Inc."
                      disabled={isSubmitting}
                    />
                  )}
                </form.Field>
              </div>

              <form.Field name="url">
                {(field) => (
                  <TextField
                    field={field}
                    id="prog-url"
                    label="URL"
                    placeholder="https://..."
                    type="url"
                    disabled={isSubmitting}
                  />
                )}
              </form.Field>

              <form.Field name="category">
                {(field) => (
                  <CategoryField field={field} disabled={isSubmitting} />
                )}
              </form.Field>

              <form.Field name="description">
                {(field) => (
                  <TextareaField
                    field={field}
                    id="prog-desc"
                    label="Description"
                    placeholder="What does this program offer?"
                    disabled={isSubmitting}
                  />
                )}
              </form.Field>

              <div className="grid grid-cols-2 gap-4">
                <form.Field name="perkTitle">
                  {(field) => (
                    <TextField
                      field={field}
                      id="perk-title"
                      label="Perk title"
                      placeholder="e.g., Free Credits"
                      disabled={isSubmitting}
                    />
                  )}
                </form.Field>
                <form.Field name="perkDescription">
                  {(field) => (
                    <TextField
                      field={field}
                      id="perk-desc"
                      label="Perk description"
                      placeholder="e.g., $100/month"
                      disabled={isSubmitting}
                    />
                  )}
                </form.Field>
              </div>

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
