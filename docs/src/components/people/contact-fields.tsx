"use client";

import { TextField } from "@/components/ui/form-field";
import type { FormFieldState } from "@/components/ui/form-field";

export type ContactFieldState = FormFieldState;

export interface ContactFieldsTranslations {
  nameLabel: string;
  namePlaceholder: string;
  roleLabel: string;
  rolePlaceholder: string;
  urlLabel: string;
  urlPlaceholder: string;
}

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
      <TextField
        field={nameField}
        id={`${idPrefix}-name`}
        label={translations.nameLabel}
        placeholder={translations.namePlaceholder}
        disabled={disabled}
      />
      <TextField
        field={roleField}
        id={`${idPrefix}-role`}
        label={translations.roleLabel}
        placeholder={translations.rolePlaceholder}
        disabled={disabled}
      />
    </div>
    <TextField
      field={urlField}
      id={`${idPrefix}-url`}
      label={translations.urlLabel}
      placeholder={translations.urlPlaceholder}
      type="url"
      disabled={disabled}
    />
  </>
);
