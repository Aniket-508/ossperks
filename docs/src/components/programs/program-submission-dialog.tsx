"use client";

import { useForm } from "@tanstack/react-form";
import { ArrowRight, CheckCircle2, Loader2, Plus, Trash2 } from "lucide-react";
import React, { useCallback, useRef, useState } from "react";
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
  eligibility: z
    .array(z.string())
    .refine(
      (arr) => arr.some((s) => s.trim().length > 0),
      "At least one eligibility item is required"
    ),
  name: z.string().min(1, "Program name is required"),
  perks: z
    .array(
      z.object({
        description: z.string(),
        title: z.string(),
      })
    )
    .refine(
      (arr) =>
        arr.some(
          (p) => p.title.trim().length > 0 && p.description.trim().length > 0
        ),
      "At least one perk with title and description is required"
    ),
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
  trigger: React.ReactElement;
  translations: {
    heading: string;
    description: string;
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
  const nextIdRef = useRef(0);
  const [eligibilityKeys, setEligibilityKeys] = useState<number[]>([0]);
  const [perkKeys, setPerkKeys] = useState<number[]>([0]);

  const { isSubmitting, submissionError, submissionStatus, submit } =
    useSubmission("/api/submit-program");

  const form = useForm({
    defaultValues: {
      category: "",
      description: "",
      eligibility: [""],
      name: "",
      perks: [{ description: "", title: "" }],
      provider: "",
      url: "",
    },
    onSubmit: async ({ value }) => {
      const eligibility = value.eligibility.filter((s) => s.trim().length > 0);
      const perks = value.perks.filter(
        (p) => p.title.trim().length > 0 && p.description.trim().length > 0
      );
      const res = await submit({
        category: value.category,
        description: value.description,
        eligibility,
        name: value.name,
        perks,
        provider: value.provider,
        url: value.url,
      });
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
    nextIdRef.current = 0;
    setEligibilityKeys([0]);
    setPerkKeys([0]);
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
      <DialogContent className="sm:max-w-lg">
        {step === "form" ? (
          <form
            id="program-form"
            onSubmit={handleFormSubmit}
            className="contents"
          >
            <DialogHeader>
              <DialogTitle>{translations.heading}</DialogTitle>
              <DialogDescription>{translations.description}</DialogDescription>
            </DialogHeader>

            <DialogBody>
              {/* Dynamic list keys and inline handlers required by TanStack Form render props */}
              {/* eslint-disable react/no-array-index-key, react-perf/jsx-no-new-function-as-prop */}
              <div className="grid gap-4">
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

                <form.Field name="eligibility">
                  {(field) => {
                    const value = field.state.value as string[];
                    return (
                      <div className="space-y-2">
                        <Label>Eligibility</Label>
                        <p className="text-xs text-fd-muted-foreground">
                          Add one requirement per field (e.g. &quot;Open-source
                          projects&quot;, &quot;Public GitHub repo&quot;).
                        </p>
                        <div className="space-y-4">
                          {value.map((item, index) => (
                            <div
                              key={eligibilityKeys[index]}
                              className="relative rounded-lg border border-fd-border bg-fd-muted/20 p-3 space-y-2"
                            >
                              {value.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon-xs"
                                  className="absolute top-3 right-3 text-fd-muted-foreground hover:text-destructive"
                                  disabled={isSubmitting}
                                  onClick={() => {
                                    const next = value.filter(
                                      (_, i) => i !== index
                                    );
                                    field.handleChange(next);
                                    setEligibilityKeys((prev) =>
                                      prev.filter((_, i) => i !== index)
                                    );
                                  }}
                                >
                                  <Trash2 />
                                </Button>
                              )}
                              <div className="pr-9">
                                <span className="text-xs font-medium text-fd-muted-foreground">
                                  Requirement {index + 1}
                                </span>
                              </div>
                              <Textarea
                                placeholder="e.g., Open-source projects"
                                value={item}
                                onChange={(e) => {
                                  const next = [...value];
                                  next[index] = e.target.value;
                                  field.handleChange(next);
                                }}
                                onBlur={field.handleBlur}
                                disabled={isSubmitting}
                                className="min-h-[60px] resize-y"
                              />
                            </div>
                          ))}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={isSubmitting}
                          onClick={() => {
                            field.handleChange([...value, ""]);
                            nextIdRef.current += 1;
                            setEligibilityKeys((prev) => [
                              ...prev,
                              nextIdRef.current,
                            ]);
                          }}
                        >
                          <Plus className="size-4" />
                          Add another
                        </Button>
                        <FieldError errors={field.state.meta.errors} />
                      </div>
                    );
                  }}
                </form.Field>

                <form.Field name="perks">
                  {(field) => {
                    const perksValue = field.state.value as {
                      title: string;
                      description: string;
                    }[];
                    return (
                      <div className="space-y-2">
                        <Label>Perks</Label>
                        <p className="text-xs text-fd-muted-foreground">
                          Add each perk with a title and description.
                        </p>
                        <div className="space-y-4">
                          {perksValue.map((perk, index) => (
                            <div
                              key={perkKeys[index]}
                              className="relative rounded-lg border border-fd-border bg-fd-muted/20 p-3 space-y-2"
                            >
                              {perksValue.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon-xs"
                                  className="absolute top-3 right-3 shrink-0 text-fd-muted-foreground hover:text-destructive"
                                  disabled={isSubmitting}
                                  onClick={() => {
                                    const next = perksValue.filter(
                                      (_, i) => i !== index
                                    );
                                    field.handleChange(next);
                                    setPerkKeys((prev) =>
                                      prev.filter((_, i) => i !== index)
                                    );
                                  }}
                                >
                                  <Trash2 />
                                </Button>
                              )}
                              <div className="pr-9">
                                <span className="text-xs font-medium text-fd-muted-foreground">
                                  Perk {index + 1}
                                </span>
                              </div>
                              <div className="grid gap-2">
                                <Input
                                  placeholder="Title (e.g., Free Credits)"
                                  value={perk.title}
                                  onChange={(e) => {
                                    const next = [...perksValue];
                                    next[index] = {
                                      ...next[index],
                                      title: e.target.value,
                                    };
                                    field.handleChange(next);
                                  }}
                                  onBlur={field.handleBlur}
                                  disabled={isSubmitting}
                                />
                                <Textarea
                                  placeholder="Description (e.g., $100/month in credits)"
                                  value={perk.description}
                                  onChange={(e) => {
                                    const next = [...perksValue];
                                    next[index] = {
                                      ...next[index],
                                      description: e.target.value,
                                    };
                                    field.handleChange(next);
                                  }}
                                  onBlur={field.handleBlur}
                                  disabled={isSubmitting}
                                  className="min-h-[60px] resize-y"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={isSubmitting}
                          onClick={() => {
                            field.handleChange([
                              ...perksValue,
                              { description: "", title: "" },
                            ]);
                            nextIdRef.current += 1;
                            setPerkKeys((prev) => [...prev, nextIdRef.current]);
                          }}
                        >
                          <Plus className="size-4" />
                          Add perk
                        </Button>
                        <FieldError errors={field.state.meta.errors} />
                      </div>
                    );
                  }}
                </form.Field>

                {submissionError && (
                  <p className="text-sm text-destructive">{submissionError}</p>
                )}
              </div>
              {/* eslint-enable react/no-array-index-key, react-perf/jsx-no-new-function-as-prop */}
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
            </DialogFooter>
          </form>
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
