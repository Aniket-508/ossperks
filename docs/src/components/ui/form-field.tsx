"use client";

import React, { useCallback } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface FormFieldState {
  state: {
    value: string;
    meta: { errors: unknown[] };
  };
  handleChange: (value: string) => void;
  handleBlur: () => void;
}

export const FieldError = ({ errors }: { errors: unknown[] }) => {
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

interface TextFieldProps {
  field: FormFieldState;
  id: string;
  label: string;
  placeholder: string;
  disabled: boolean;
  type?: string;
}

export const TextField = ({
  field,
  id,
  label,
  placeholder,
  disabled,
  type = "text",
}: TextFieldProps) => {
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

interface TextareaFieldProps {
  field: FormFieldState;
  id: string;
  label: string;
  placeholder: string;
  disabled: boolean;
}

export const TextareaField = ({
  field,
  id,
  label,
  placeholder,
  disabled,
}: TextareaFieldProps) => {
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
