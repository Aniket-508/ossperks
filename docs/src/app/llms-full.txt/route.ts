import { cliSource, getLLMText, programsSource } from "@/lib/source";

export const revalidate = false;

export const GET = async () => {
  const cliPages = cliSource.getPages();
  const programPages = programsSource.getPages();

  const allPages = [...cliPages, ...programPages];
  const scanned = await Promise.all(allPages.map(getLLMText));

  return new Response(scanned.join("\n\n"));
};
