import { ImageResponse } from "@takumi-rs/image-response";
import { generate as DefaultImage } from "fumadocs-ui/og/takumi";
import { notFound } from "next/navigation";

import { getProgramPageImage, programsSource } from "@/lib/source";

export const revalidate = false;

export const GET = async (
  _req: Request,
  { params }: RouteContext<"/og/programs/[slug]">
) => {
  const { slug } = await params;
  const page = programsSource.getPage([slug]);
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
  programsSource.getPages().map((page) => ({
    slug: getProgramPageImage(page).segments,
  }));
