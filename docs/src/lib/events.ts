import { track } from "@vercel/analytics";
import { z } from "zod";

const eventSchema = z.object({
  name: z.enum([
    "copy_link",
    "navigate_next_program",
    "navigate_previous_program",
    "share_click",
    "search_programs",
    "check_eligibility",
    "view_program",
    "apply_program",
    "filter_programs",
    "submit_program",
    "view_person",
    "submit_contact",
  ]),
  properties: z
    .record(
      z.string(),
      z.union([z.string(), z.number(), z.boolean(), z.null()]),
    )
    .optional(),
});

export type Event = z.infer<typeof eventSchema>;

export const trackEvent = (input: Event): void => {
  const event = eventSchema.parse(input);
  if (event) {
    track(event.name, event.properties);
  }
};
