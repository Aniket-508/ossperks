import "server-only";
import type { Program } from "@ossperks/core";
import {
  programs as allPrograms,
  getProgramBySlug,
  getFeaturedPrograms as getFeaturedProgramsBase,
} from "@ossperks/core";

import { i18n } from "@/lib/i18n";
import { programsSource } from "@/lib/source";

const parsePerks = (
  section: string
): { title: string; description: string }[] =>
  section
    .split("\n")
    .filter((l) => /^[*-]\s+\*\*/.test(l.trim()))
    .map((line) => {
      const match = line.match(/\*\*(.+?)\*\*\s*[:：]\s*(.*)/);
      return match
        ? { description: match[2], title: match[1] }
        : { description: "", title: line };
    });

const parseUnorderedList = (section: string): string[] =>
  section
    .split("\n")
    .filter((l) => /^[*-]\s+/.test(l.trim()))
    .map((l) => l.replace(/^[*-]\s+/, "").trim());

const parseOrderedList = (section: string): string[] =>
  section
    .split("\n")
    .filter((l) => /^\d+\.\s+/.test(l.trim()))
    .map((l) => l.replace(/^\d+\.\s+/, "").trim());

const splitSections = (text: string): string[] =>
  text.split(/^.+\[#.+\]\s*$/m).slice(1);

const parseSections = (sections: string[], program: Program) => {
  let idx = 0;
  const perks = sections[idx] ? parsePerks(sections[idx]) : program.perks;
  idx += 1;
  const eligibility = sections[idx]
    ? parseUnorderedList(sections[idx])
    : program.eligibility;
  idx += 1;

  let requirements = program.requirements ?? [];
  if (program.requirements?.length && sections[idx]) {
    requirements = parseUnorderedList(sections[idx]);
    idx += 1;
  }

  let applicationProcess = program.applicationProcess ?? [];
  if (program.applicationProcess?.length && sections[idx]) {
    applicationProcess = parseOrderedList(sections[idx]);
  }

  return { applicationProcess, eligibility, perks, requirements };
};

const translateProgram = async (
  program: Program,
  lang: string
): Promise<Program> => {
  if (lang === i18n.defaultLanguage) {
    return program;
  }

  const page = programsSource.getPage([program.slug], lang);
  if (!page) {
    return program;
  }

  const text = await page.data.getText("processed");
  const sections = splitSections(text);
  const parsed = parseSections(sections, program);

  return {
    ...program,
    applicationProcess: parsed.applicationProcess,
    description: page.data.description ?? program.description,
    eligibility: parsed.eligibility,
    name: page.data.title,
    perks: parsed.perks,
    requirements: parsed.requirements,
  };
};

export const getPrograms = async (lang: string) => {
  const results = await Promise.all(
    allPrograms.map((p) => translateProgram(p, lang))
  );
  return results;
};

export const getProgram = async (
  slug: string,
  lang: string
): Promise<Program | undefined> => {
  const program = getProgramBySlug(slug);
  if (!program) {
    return undefined;
  }
  return await translateProgram(program, lang);
};

export const getFeaturedPrograms = async (lang: string) => {
  const results = await Promise.all(
    getFeaturedProgramsBase().map((p) => translateProgram(p, lang))
  );
  return results;
};
