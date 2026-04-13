import type { Contact, Program } from "./schema";

export interface ProgramSummary {
  category: Program["category"];
  description: string;
  name: string;
  perks: Program["perks"];
  provider: string;
  slug: string;
  tags?: string[];
}

export interface PersonWithProgram {
  contact: Contact;
  programSlug: string;
  provider: string;
}

export interface PersonDetail {
  contact: Contact;
  slug: string;
  programs: ProgramSummary[];
}
