"use client";

import { useForm } from "@tanstack/react-form";
import { ArrowRight, CheckCircle2, Loader2, Plus, Trash2 } from "lucide-react";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { z } from "zod";

import { TagsInput } from "@/components/programs/tags-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

const COMMON_TAGS = [
  "ai",
  "analytics",
  "api-credits",
  "automation",
  "backend",
  "cdn",
  "ci-cd",
  "cloud",
  "code-quality",
  "community",
  "containers",
  "credits",
  "database",
  "deployment",
  "developer-tools",
  "devops",
  "documentation",
  "hosting",
  "infrastructure",
  "monitoring",
  "observability",
  "open-source",
  "performance",
  "security",
  "serverless",
  "storage",
  "testing",
];

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
  return <p className="text-destructive text-xs">{message}</p>;
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
    [field],
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
    [field],
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

const canSubmitSelector = (s: { canSubmit: boolean }) => s.canSubmit;

interface ProgramSubmissionTranslations {
  heading: string;
  description: string;
  form: {
    nameLabel: string;
    namePlaceholder: string;
    providerLabel: string;
    providerPlaceholder: string;
    urlLabel: string;
    urlPlaceholder: string;
    categoryLabel: string;
    categoryPlaceholder: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    eligibilityLabel: string;
    eligibilityHelp: string;
    eligibilityPlaceholder: string;
    requirementLabel: string;
    addRequirement: string;
    perksLabel: string;
    perksHelp: string;
    perkLabel: string;
    perkTitlePlaceholder: string;
    perkDescriptionPlaceholder: string;
    addPerk: string;
    applicationProcessLabel: string;
    applicationProcessHelp: string;
    applicationProcessPlaceholder: string;
    stepLabel: string;
    addStep: string;
    tagsLabel: string;
    tagsHelp: string;
    tagsPlaceholder: string;
    applicationUrlCheckbox: string;
    applicationUrlLabel: string;
    applicationUrlPlaceholder: string;
    tagsAddNew: string;
    tagsNoResults: string;
  };
  validation: {
    categoryRequired: string;
    descriptionRequired: string;
    eligibilityRequired: string;
    invalidApplicationUrl: string;
    nameRequired: string;
    perkRequired: string;
    providerRequired: string;
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

interface ProgramSubmissionDialogProps {
  trigger: React.ReactElement;
  translations: ProgramSubmissionTranslations;
  categoryLabels: Record<string, string>;
}

export const ProgramSubmissionDialog = ({
  trigger,
  translations,
  categoryLabels,
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
  const [applicationProcessKeys, setApplicationProcessKeys] = useState<
    number[]
  >([0]);
  const [hasApplicationUrl, setHasApplicationUrl] = useState(false);

  const t = translations;

  const programSchema = useMemo(
    () =>
      z.object({
        applicationProcess: z.array(z.string()),
        applicationUrl: z
          .string()
          .url(t.validation.invalidApplicationUrl)
          .or(z.literal("")),
        category: z.string().min(1, t.validation.categoryRequired),
        description: z.string().min(1, t.validation.descriptionRequired),
        eligibility: z
          .array(z.string())
          .refine(
            (arr) => arr.some((s) => s.trim().length > 0),
            t.validation.eligibilityRequired,
          ),
        name: z.string().min(1, t.validation.nameRequired),
        perks: z
          .array(z.object({ description: z.string(), title: z.string() }))
          .refine(
            (arr) =>
              arr.some(
                (p) =>
                  p.title.trim().length > 0 && p.description.trim().length > 0,
              ),
            t.validation.perkRequired,
          ),
        provider: z.string().min(1, t.validation.providerRequired),
        tags: z.array(z.string()),
        url: z.string().url(t.validation.invalidUrl),
      }),
    [t.validation],
  );

  const { isSubmitting, submissionError, submissionStatus, submit } =
    useSubmission("/api/submit-program", {
      error: t.submitError,
      submitting: t.submitting,
    });

  const form = useForm({
    defaultValues: {
      applicationProcess: [""],
      applicationUrl: "",
      category: "",
      description: "",
      eligibility: [""],
      name: "",
      perks: [{ description: "", title: "" }],
      provider: "",
      tags: [] as string[],
      url: "",
    },
    onSubmit: async ({ value }) => {
      const eligibility = value.eligibility.filter((s) => s.trim().length > 0);
      const perks = value.perks.filter(
        (p) => p.title.trim().length > 0 && p.description.trim().length > 0,
      );
      const applicationProcess = value.applicationProcess.filter(
        (s) => s.trim().length > 0,
      );
      const res = await submit({
        applicationProcess,
        ...(value.applicationUrl.trim() && {
          applicationUrl: value.applicationUrl.trim(),
        }),
        category: value.category,
        description: value.description,
        eligibility,
        name: value.name,
        perks,
        provider: value.provider,
        tags: value.tags,
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
    setApplicationProcessKeys([0]);
    setHasApplicationUrl(false);
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
      <DialogContent className="sm:max-w-lg">
        {step === "form" ? (
          <form
            id="program-form"
            onSubmit={handleFormSubmit}
            className="contents"
          >
            <DialogHeader>
              <DialogTitle>{t.heading}</DialogTitle>
              <DialogDescription>{t.description}</DialogDescription>
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
                        label={t.form.nameLabel}
                        placeholder={t.form.namePlaceholder}
                        disabled={isSubmitting}
                      />
                    )}
                  </form.Field>
                  <form.Field name="provider">
                    {(field) => (
                      <TextField
                        field={field}
                        id="prog-provider"
                        label={t.form.providerLabel}
                        placeholder={t.form.providerPlaceholder}
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
                      label={t.form.urlLabel}
                      placeholder={t.form.urlPlaceholder}
                      type="url"
                      disabled={isSubmitting}
                    />
                  )}
                </form.Field>

                <div className="space-y-4">
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <Checkbox
                      checked={hasApplicationUrl}
                      onCheckedChange={(checked) => {
                        setHasApplicationUrl(checked);
                        if (!checked) {
                          form.setFieldValue("applicationUrl", "");
                        }
                      }}
                      disabled={isSubmitting}
                    />
                    {t.form.applicationUrlCheckbox}
                  </label>
                  {hasApplicationUrl && (
                    <form.Field name="applicationUrl">
                      {(field) => (
                        <TextField
                          field={field}
                          id="prog-application-url"
                          label={t.form.applicationUrlLabel}
                          placeholder={t.form.applicationUrlPlaceholder}
                          type="url"
                          disabled={isSubmitting}
                        />
                      )}
                    </form.Field>
                  )}
                </div>

                <form.Field name="category">
                  {(field) => {
                    const handleChange = (val: string | number | null) =>
                      field.handleChange(val as string);
                    return (
                      <div className="space-y-2">
                        <Label>{t.form.categoryLabel}</Label>
                        <Select
                          value={field.state.value}
                          onValueChange={handleChange}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={t.form.categoryPlaceholder}
                            >
                              {categoryLabels[field.state.value]}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(categoryLabels)
                              .toSorted()
                              .map((val) => (
                                <SelectItem key={val} value={val}>
                                  {categoryLabels[val]}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FieldError errors={field.state.meta.errors} />
                      </div>
                    );
                  }}
                </form.Field>

                <form.Field name="description">
                  {(field) => (
                    <TextareaField
                      field={field}
                      id="prog-desc"
                      label={t.form.descriptionLabel}
                      placeholder={t.form.descriptionPlaceholder}
                      disabled={isSubmitting}
                    />
                  )}
                </form.Field>

                <form.Field name="eligibility">
                  {(field) => {
                    const value = field.state.value as string[];
                    return (
                      <div className="space-y-2">
                        <Label>{t.form.eligibilityLabel}</Label>
                        <p className="text-fd-muted-foreground text-xs">
                          {t.form.eligibilityHelp}
                        </p>
                        <div className="space-y-4">
                          {value.map((item, index) => (
                            <div
                              key={eligibilityKeys[index]}
                              className="border-fd-border bg-fd-muted/20 relative space-y-2 rounded-lg border p-3"
                            >
                              {value.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon-xs"
                                  className="text-fd-muted-foreground hover:text-destructive absolute top-3 right-3"
                                  disabled={isSubmitting}
                                  onClick={() => {
                                    const next = value.filter(
                                      (_, i) => i !== index,
                                    );
                                    field.handleChange(next);
                                    setEligibilityKeys((prev) =>
                                      prev.filter((_, i) => i !== index),
                                    );
                                  }}
                                >
                                  <Trash2 />
                                </Button>
                              )}
                              <div className="pr-9">
                                <span className="text-fd-muted-foreground text-xs font-medium">
                                  {t.form.requirementLabel.replace(
                                    "{index}",
                                    String(index + 1),
                                  )}
                                </span>
                              </div>
                              <Textarea
                                placeholder={t.form.eligibilityPlaceholder}
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
                          <Plus />
                          {t.form.addRequirement}
                        </Button>
                        <FieldError errors={field.state.meta.errors} />
                      </div>
                    );
                  }}
                </form.Field>

                <form.Field name="applicationProcess">
                  {(field) => {
                    const value = field.state.value as string[];
                    return (
                      <div className="space-y-2">
                        <Label>{t.form.applicationProcessLabel}</Label>
                        <p className="text-fd-muted-foreground text-xs">
                          {t.form.applicationProcessHelp}
                        </p>
                        <div className="space-y-4">
                          {value.map((item, index) => (
                            <div
                              key={applicationProcessKeys[index]}
                              className="border-fd-border bg-fd-muted/20 relative space-y-2 rounded-lg border p-3"
                            >
                              {value.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon-xs"
                                  className="text-fd-muted-foreground hover:text-destructive absolute top-3 right-3"
                                  disabled={isSubmitting}
                                  onClick={() => {
                                    const next = value.filter(
                                      (_, i) => i !== index,
                                    );
                                    field.handleChange(next);
                                    setApplicationProcessKeys((prev) =>
                                      prev.filter((_, i) => i !== index),
                                    );
                                  }}
                                >
                                  <Trash2 />
                                </Button>
                              )}
                              <div className="pr-9">
                                <span className="text-fd-muted-foreground text-xs font-medium">
                                  {t.form.stepLabel.replace(
                                    "{index}",
                                    String(index + 1),
                                  )}
                                </span>
                              </div>
                              <Textarea
                                placeholder={
                                  t.form.applicationProcessPlaceholder
                                }
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
                            setApplicationProcessKeys((prev) => [
                              ...prev,
                              nextIdRef.current,
                            ]);
                          }}
                        >
                          <Plus />
                          {t.form.addStep}
                        </Button>
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
                        <Label>{t.form.perksLabel}</Label>
                        <p className="text-fd-muted-foreground text-xs">
                          {t.form.perksHelp}
                        </p>
                        <div className="space-y-4">
                          {perksValue.map((perk, index) => (
                            <div
                              key={perkKeys[index]}
                              className="border-fd-border bg-fd-muted/20 relative space-y-2 rounded-lg border p-3"
                            >
                              {perksValue.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon-xs"
                                  className="text-fd-muted-foreground hover:text-destructive absolute top-3 right-3 shrink-0"
                                  disabled={isSubmitting}
                                  onClick={() => {
                                    const next = perksValue.filter(
                                      (_, i) => i !== index,
                                    );
                                    field.handleChange(next);
                                    setPerkKeys((prev) =>
                                      prev.filter((_, i) => i !== index),
                                    );
                                  }}
                                >
                                  <Trash2 />
                                </Button>
                              )}
                              <div className="pr-9">
                                <span className="text-fd-muted-foreground text-xs font-medium">
                                  {t.form.perkLabel.replace(
                                    "{index}",
                                    String(index + 1),
                                  )}
                                </span>
                              </div>
                              <div className="grid gap-2">
                                <Input
                                  placeholder={t.form.perkTitlePlaceholder}
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
                                  placeholder={
                                    t.form.perkDescriptionPlaceholder
                                  }
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
                          <Plus />
                          {t.form.addPerk}
                        </Button>
                        <FieldError errors={field.state.meta.errors} />
                      </div>
                    );
                  }}
                </form.Field>

                <form.Field name="tags">
                  {(field) => (
                    <div className="space-y-2">
                      <Label>{t.form.tagsLabel}</Label>
                      <p className="text-fd-muted-foreground text-xs">
                        {t.form.tagsHelp}
                      </p>
                      <TagsInput
                        items={COMMON_TAGS}
                        value={field.state.value as string[]}
                        onChange={(tags) => field.handleChange(tags)}
                        placeholder={t.form.tagsPlaceholder}
                        disabled={isSubmitting}
                        addNewLabel={t.form.tagsAddNew}
                        noResultsLabel={t.form.tagsNoResults}
                      />
                    </div>
                  )}
                </form.Field>

                {submissionError && (
                  <p className="text-destructive text-sm">{submissionError}</p>
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
