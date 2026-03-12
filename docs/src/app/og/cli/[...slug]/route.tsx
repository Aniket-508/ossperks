import { ImageResponse } from "@takumi-rs/image-response";
import { generate as DefaultImage } from "fumadocs-ui/og/takumi";
import { notFound } from "next/navigation";

import { parseLocaleSlugs } from "@/lib/i18n";
import { cliSource, getCliPageImage } from "@/lib/source";

export const revalidate = false;

export const GET = async (
  _req: Request,
  { params }: RouteContext<"/og/cli/[...slug]">
) => {
  const { slug } = await params;
  const localized = parseLocaleSlugs(slug.slice(0, -1));
  const page = cliSource.getPage(localized.slugs, localized.locale);
  if (!page) {
    notFound();
  }

  return new ImageResponse(
    <DefaultImage
      title={page.data.title}
      description={page.data.description}
      site="OSS Perks"
    />,
    {
      format: "webp",
      height: 630,
      width: 1200,
    }
  );
};

export const generateStaticParams = () =>
  cliSource.getPages().map((page) => ({
    slug: getCliPageImage(page).segments,
  }));
