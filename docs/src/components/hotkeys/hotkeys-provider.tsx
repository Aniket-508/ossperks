"use client";

import { HotkeysProvider } from "@tanstack/react-hotkeys";
import type { ReactNode } from "react";

export const AppHotkeysProvider = ({ children }: { children: ReactNode }) => (
  <HotkeysProvider>{children}</HotkeysProvider>
);
