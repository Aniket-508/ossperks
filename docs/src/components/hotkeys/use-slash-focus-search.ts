"use client";

import { useHotkey } from "@tanstack/react-hotkeys";
import type { RefObject } from "react";

import { isEditableTarget } from "@/components/hotkeys/editable-target";

/** Focus search input when `/` is pressed (not when typing in a form field). */
export const useSlashFocusSearch = (
  inputRef: RefObject<HTMLInputElement | null>,
): void => {
  useHotkey("/", (event) => {
    if (isEditableTarget(document.activeElement)) {
      return;
    }
    event.preventDefault();
    const input = inputRef.current;
    if (input) {
      input.focus();
      input.select();
    }
  });
};
