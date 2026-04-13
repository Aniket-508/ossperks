"use client";

import { RootProvider as FumadocsRootProvider } from "fumadocs-ui/provider/next";
import { usePathname, useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { useCallback } from "react";

import { isLocale } from "@/i18n/config";
import { withLocalePrefix } from "@/i18n/navigation";

type FumadocsRootProviderProps = ComponentProps<typeof FumadocsRootProvider>;

export const RootProvider = ({
  i18n,
  children,
  ...rest
}: FumadocsRootProviderProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const onLocaleChange = useCallback(
    (newLocale: string) => {
      const segments = pathname.split("/").filter((v) => v.length > 0);
      const pathWithoutLocale =
        segments[0] && isLocale(segments[0])
          ? (`/${segments.slice(1).join("/")}` as `/${string}`)
          : (pathname as `/${string}`);
      const nextPath = withLocalePrefix(newLocale, pathWithoutLocale);
      router.push(
        `${nextPath}${window.location.search}${window.location.hash}`,
      );
    },
    [pathname, router],
  );

  return (
    <FumadocsRootProvider
      {...rest}
      i18n={i18n ? { ...i18n, onLocaleChange } : undefined}
    >
      {children}
    </FumadocsRootProvider>
  );
};
