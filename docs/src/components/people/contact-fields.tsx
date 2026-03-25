"use client";

import React, { useCallback } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface ContactFieldState {
  state: {
    value: string;
    meta: { errors: unknown[] };
  };
  handleChange: (value: string) => void;
  handleBlur: () => void;
}

export interface ContactFieldsTranslations {
  nameLabel: string;
  namePlaceholder: string;
  roleLabel: string;
  rolePlaceholder: string;
  urlLabel: string;
  urlPlaceholder: string;
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

const ContactTextField = ({
  field,
  id,
  label,
  placeholder,
  disabled,
  type = "text",
}: {
  field: ContactFieldState;
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

interface ContactFieldsProps {
  nameField: ContactFieldState;
  roleField: ContactFieldState;
  urlField: ContactFieldState;
  translations: ContactFieldsTranslations;
  disabled: boolean;
  idPrefix?: string;
}

export const ContactFields = ({
  nameField,
  roleField,
  urlField,
  translations,
  disabled,
  idPrefix = "contact",
}: ContactFieldsProps) => (
  <>
    <div className="grid grid-cols-2 gap-4">
      <ContactTextField
        field={nameField}
        id={`${idPrefix}-name`}
        label={translations.nameLabel}
        placeholder={translations.namePlaceholder}
        disabled={disabled}
      />
      <ContactTextField
        field={roleField}
        id={`${idPrefix}-role`}
        label={translations.roleLabel}
        placeholder={translations.rolePlaceholder}
        disabled={disabled}
      />
    </div>
    <ContactTextField
      field={urlField}
      id={`${idPrefix}-url`}
      label={translations.urlLabel}
      placeholder={translations.urlPlaceholder}
      type="url"
      disabled={disabled}
    />
  </>
);
