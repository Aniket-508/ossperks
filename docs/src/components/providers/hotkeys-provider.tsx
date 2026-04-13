"use client";

import { HotkeysProvider as TanstackHotkeysProvider } from "@tanstack/react-hotkeys";
import type { ReactNode } from "react";

export const HotkeysProvider = ({ children }: { children: ReactNode }) => (
  <TanstackHotkeysProvider>{children}</TanstackHotkeysProvider>
);
