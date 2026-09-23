export const DECK = {
  title: "Engineering in the AI Era",
  subtitle: "A Management Perspective",
  speaker: "Arif H. Rezaldy",
  event: "SWE Growth Chapter DIY",
  dateISO: "2026-09-26",
  dateLabel: "26 September 2026",
  description:
    "AI is making software implementation cheaper and faster. This talk looks at what that changes in what we expect from engineers, from a management perspective.",
} as const;

/** Chapter grouping used by the overview slide and the progress rail. */
export const CHAPTERS = [
  { id: "change", index: "01", label: "The change", start: 5, end: 8 },
  { id: "economics", index: "02", label: "The economics", start: 9, end: 12 },
  { id: "management", index: "03", label: "The management lens", start: 13, end: 14 },
  { id: "value", index: "04", label: "Output vs outcome", start: 15, end: 16 },
  { id: "engineer", index: "05", label: "What good looks like now", start: 17, end: 20 },
  { id: "action", index: "06", label: "What we do about it", start: 21, end: 25 },
] as const;

export type ChapterId = (typeof CHAPTERS)[number]["id"];
