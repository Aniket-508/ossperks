"use client";

import { useForm } from "@tanstack/react-form";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { z } from "zod";

import { ContactFields } from "@/components/people/contact-fields";
import { TagsInput } from "@/components/programs/tags-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  FieldError,
  TextField,
  TextareaField,
} from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ROUTES } from "@/constants/routes";
import { useAutofill } from "@/hooks/use-autofill";
import { useSubmission } from "@/hooks/use-submission";
import { withLocalePrefix } from "@/i18n/navigation";
import type { ProgramsTranslations } from "@/locales/en/programs";

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

const canSubmitSelector = (s: { canSubmit: boolean }) => s.canSubmit;

interface ProgramSubmitPageClientProps {
  categoryLabels: Record<string, string>;
  lang: string;
  translations: ProgramsTranslations["submit"];
}

export const ProgramSubmitPageClient = ({
  categoryLabels,
  lang,
  translations: t,
}: ProgramSubmitPageClientProps) => {
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
  const [hasContact, setHasContact] = useState(false);
  const [autofillUrl, setAutofillUrl] = useState("");

  const { autofill, autofillError, isAutofilling } = useAutofill(
    "/api/autofill-program",
    { error: t.autofill.error, loading: t.autofill.loading },
  );

  const programSchema = useMemo(
    () =>
      z.object({
        applicationProcess: z.array(z.string()),
        applicationUrl: z
          .string()
          .url(t.validation.invalidApplicationUrl)
          .or(z.literal("")),
        category: z.string().min(1, t.validation.categoryRequired),
        contactName: z.string(),
        contactRole: z.string(),
        contactUrl: z.string().url(t.validation.invalidUrl).or(z.literal("")),
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
      contactName: "",
      contactRole: "",
      contactUrl: "",
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

      const payload: Record<string, unknown> = {
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
      };

      if (hasContact && value.contactName.trim()) {
        payload.contact = {
          name: value.contactName.trim(),
          role: value.contactRole.trim(),
          ...(value.contactUrl.trim() && { url: value.contactUrl.trim() }),
        };
      }

      const res = await submit(payload);
      if (res.success) {
        setResult({ prNumber: res.prNumber, prUrl: res.prUrl });
        setStep("success");
      }
    },
    validators: {
      onChange: programSchema,
    },
  });

  const handleAutofill = useCallback(async () => {
    if (!autofillUrl.trim()) {
      return;
    }
    const data = await autofill(autofillUrl.trim());
    if (!data) {
      return;
    }

    const d = data as Record<string, unknown>;
    if (typeof d.name === "string") {
      form.setFieldValue("name", d.name);
    }
    if (typeof d.provider === "string") {
      form.setFieldValue("provider", d.provider);
    }
    if (typeof d.url === "string") {
      form.setFieldValue("url", d.url);
    } else {
      form.setFieldValue("url", autofillUrl.trim());
    }
    if (typeof d.category === "string") {
      form.setFieldValue("category", d.category);
    }
    if (typeof d.description === "string") {
      form.setFieldValue("description", d.description);
    }

    if (Array.isArray(d.eligibility) && d.eligibility.length > 0) {
      form.setFieldValue("eligibility", d.eligibility as string[]);
      const keys = (d.eligibility as string[]).map(() => {
        nextIdRef.current += 1;
        return nextIdRef.current;
      });
      setEligibilityKeys(keys);
    }

    if (Array.isArray(d.perks) && d.perks.length > 0) {
      form.setFieldValue(
        "perks",
        d.perks as { title: string; description: string }[],
      );
      const keys = (d.perks as unknown[]).map(() => {
        nextIdRef.current += 1;
        return nextIdRef.current;
      });
      setPerkKeys(keys);
    }

    if (
      Array.isArray(d.applicationProcess) &&
      d.applicationProcess.length > 0
    ) {
      form.setFieldValue(
        "applicationProcess",
        d.applicationProcess as string[],
      );
      const keys = (d.applicationProcess as string[]).map(() => {
        nextIdRef.current += 1;
        return nextIdRef.current;
      });
      setApplicationProcessKeys(keys);
    }

    if (typeof d.applicationUrl === "string" && d.applicationUrl) {
      form.setFieldValue("applicationUrl", d.applicationUrl);
      setHasApplicationUrl(true);
    }

    if (Array.isArray(d.tags)) {
      form.setFieldValue("tags", d.tags as string[]);
    }
  }, [autofillUrl, autofill, form]);

  const handleFormSubmit = useCallback(
    (e: React.SubmitEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form],
  );

  if (step === "success") {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <CheckCircle2 className="mb-4 size-16 text-green-500" />
        <h1 className="mb-2 text-2xl font-bold">{t.success.heading}</h1>
        <p className="text-fd-muted-foreground mb-6">{t.success.message}</p>
        {result && (
          <div className="flex flex-col gap-3 sm:flex-row">
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
            <Button
              nativeButton={false}
              render={
                <Link href={withLocalePrefix(lang, ROUTES.PROGRAMS)}>
                  {t.success.close}
                </Link>
              }
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12">
      <div className="mb-6">
        <Button
          variant="link"
          size="sm"
          nativeButton={false}
          render={
            <Link href={withLocalePrefix(lang, ROUTES.PROGRAMS)}>
              <ArrowLeft />
              {t.backToAll}
            </Link>
          }
        />
      </div>

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">{t.heading}</h1>
        <p className="text-fd-muted-foreground">{t.description}</p>
      </div>

      <form onSubmit={handleFormSubmit}>
        {/* eslint-disable react/no-array-index-key, react-perf/jsx-no-new-function-as-prop */}
        <div className="grid gap-6">
          <div className="bg-fd-muted/50 border-fd-border rounded-lg border p-4">
            <div className="mb-3">
              <h4 className="text-sm font-semibold">{t.autofill.heading}</h4>
              <p className="text-fd-muted-foreground text-xs">
                {t.autofill.description}
              </p>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder={t.autofill.placeholder}
                value={autofillUrl}
                onChange={(e) => setAutofillUrl(e.target.value)}
                disabled={isAutofilling || isSubmitting}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                disabled={isAutofilling || isSubmitting || !autofillUrl.trim()}
                onClick={handleAutofill}
              >
                {isAutofilling ? (
                  <>
                    <Loader2 className="animate-spin" />
                    {t.autofill.loading}
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    {t.autofill.button}
                  </>
                )}
              </Button>
            </div>
            {autofillError && (
              <p className="text-destructive mt-2 text-xs">{autofillError}</p>
            )}
          </div>

          <Separator />

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
                      <SelectValue placeholder={t.form.categoryPlaceholder}>
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

          <Separator />

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
                              const next = value.filter((_, i) => i !== index);
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
                              const next = value.filter((_, i) => i !== index);
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
                          placeholder={t.form.applicationProcessPlaceholder}
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

          <Separator />

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
                            placeholder={t.form.perkDescriptionPlaceholder}
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

          <Separator />

          <Collapsible
            open={hasContact}
            onOpenChange={setHasContact}
            className="space-y-4"
          >
            <CollapsibleTrigger
              type="button"
              disabled={isSubmitting}
              className="hover:bg-fd-muted/50 flex w-full cursor-pointer items-center gap-2 rounded-md py-1 text-left text-sm font-medium outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              <ChevronDown
                className={`size-4 shrink-0 transition-transform ${hasContact ? "rotate-0" : "-rotate-90"}`}
              />
              {t.form.contactToggle}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="border-fd-border bg-fd-muted/20 grid gap-4 rounded-lg border p-4">
                <form.Field name="contactName">
                  {(nameField) => (
                    <form.Field name="contactRole">
                      {(roleField) => (
                        <form.Field name="contactUrl">
                          {(urlField) => (
                            <ContactFields
                              nameField={nameField}
                              roleField={roleField}
                              urlField={urlField}
                              translations={{
                                nameLabel: t.form.contactNameLabel,
                                namePlaceholder: t.form.contactNamePlaceholder,
                                roleLabel: t.form.contactRoleLabel,
                                rolePlaceholder: t.form.contactRolePlaceholder,
                                urlLabel: t.form.contactUrlLabel,
                                urlPlaceholder: t.form.contactUrlPlaceholder,
                              }}
                              disabled={isSubmitting}
                              idPrefix="prog-contact"
                            />
                          )}
                        </form.Field>
                      )}
                    </form.Field>
                  )}
                </form.Field>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {submissionError && (
            <p className="text-destructive text-sm">{submissionError}</p>
          )}

          <div className="flex justify-end">
            <form.Subscribe selector={canSubmitSelector}>
              {(canSubmit) => (
                <Button
                  type="submit"
                  size="lg"
                  disabled={!canSubmit || isSubmitting}
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
          </div>
        </div>
        {/* eslint-enable react/no-array-index-key, react-perf/jsx-no-new-function-as-prop */}
      </form>
    </div>
  );
};
