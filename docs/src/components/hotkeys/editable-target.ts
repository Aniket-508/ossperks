/** True if the user is typing in an input, textarea, or similar. */
export const isEditableTarget = (el: EventTarget | null): boolean => {
  if (!el || !(el instanceof HTMLElement)) {
    return false;
  }
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
    return true;
  }
  if (el.isContentEditable) {
    return true;
  }
  return Boolean(el.closest("[role='combobox']"));
};
