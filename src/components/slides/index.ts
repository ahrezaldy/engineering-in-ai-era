import type { ComponentType } from "react";
import type { TransitionKind } from "@/lib/transitions";

import { S01Intro } from "./S01Intro";
import { S26Speaker } from "./S26Speaker";
import { S02Overview } from "./S02Overview";
import { S03Question } from "./S03Question";
import { S04Before } from "./S04Before";
import { S05Today } from "./S05Today";
import { S06Cheaper } from "./S06Cheaper";
import { S07Gate } from "./S07Gate";
import { S08Possible } from "./S08Possible";
import { S09MoreValuable } from "./S09MoreValuable";
import { S10WrongThing } from "./S10WrongThing";
import { S11MgmtQuestions } from "./S11MgmtQuestions";
import { S12ValueStack } from "./S12ValueStack";
import { S13ValueNotVolume } from "./S13ValueNotVolume";
import { S14CLevel } from "./S14CLevel";
import { S15Judgment } from "./S15Judgment";
import { S16Productivity } from "./S16Productivity";
import { S17Measure } from "./S17Measure";
import { S18SkillShift } from "./S18SkillShift";
import { S19Seniority } from "./S19Seniority";
import { S20SeniorMeans } from "./S20SeniorMeans";
import { S21StartStop } from "./S21StartStop";
import { S22SameTicket } from "./S22SameTicket";
import { S23Recap } from "./S23Recap";
import { S24Demo } from "./S24Demo";
import { S25QA } from "./S25QA";

export type SlideProps = { slideIndex: number };

export type SlideDef = {
  id: string;
  title: string;
  kind: "intro" | "speaker" | "overview" | "content" | "recap" | "demo" | "qa";
  Component: ComponentType<SlideProps>;
  has3d?: boolean;
  transition?: TransitionKind;
};

export const SLIDES: SlideDef[] = [
  { id: "intro", title: "Engineering in the AI Era", kind: "intro", Component: S01Intro, has3d: true, transition: "dolly" },
  // Push, not dolly: S01 exits on a dolly and dolly-into-dolly is a blurry scale-mush.
  { id: "speaker", title: "Arif H. Rezaldy", kind: "speaker", Component: S26Speaker },
  { id: "overview", title: "Where we're going", kind: "overview", Component: S02Overview },

  // 01 · The change
  { id: "question", title: "The uncomfortable question", kind: "content", Component: S03Question, transition: "dolly" },
  { id: "before", title: "Before AI: build software", kind: "content", Component: S04Before },
  { id: "today", title: "Today: AI is inside the loop", kind: "content", Component: S05Today },
  { id: "cheaper", title: "Implementation is becoming cheaper", kind: "content", Component: S06Cheaper },

  // 02 · The economics
  { id: "gate", title: "AI changes the economics", kind: "content", Component: S07Gate },
  { id: "possible", title: "What becomes possible", kind: "content", Component: S08Possible },
  { id: "valuable", title: "What becomes more valuable?", kind: "content", Component: S09MoreValuable, transition: "dolly" },
  { id: "wrong-thing", title: "Faster at building the wrong thing", kind: "content", Component: S10WrongThing },

  // 03 · The management lens
  { id: "mgmt-questions", title: "The questions are changing", kind: "content", Component: S11MgmtQuestions },
  { id: "c-level", title: "What C-level actually asks", kind: "content", Component: S14CLevel },

  // 04 · Output vs outcome
  { id: "productivity", title: "AI productivity is not business productivity", kind: "content", Component: S16Productivity },
  { id: "measure", title: "Measure differently", kind: "content", Component: S17Measure },

  // 05 · What good looks like now
  { id: "value-stack", title: "The new engineering value stack", kind: "content", Component: S12ValueStack, has3d: true },
  { id: "value-not-volume", title: "Value, not volume", kind: "content", Component: S13ValueNotVolume, transition: "dolly" },
  { id: "skill-shift", title: "The skill shift", kind: "content", Component: S18SkillShift },
  { id: "judgment", title: "AI generates. You decide.", kind: "content", Component: S15Judgment, has3d: true, transition: "dolly" },

  // 06 · What we do about it
  { id: "seniority", title: "Junior to Mid to Senior", kind: "content", Component: S19Seniority, has3d: true },
  { id: "senior-means", title: "What senior means now", kind: "content", Component: S20SeniorMeans },
  { id: "start-stop", title: "Start / Stop", kind: "content", Component: S21StartStop },
  { id: "same-ticket", title: "Same ticket, different engineer", kind: "content", Component: S22SameTicket },

  { id: "recap", title: "The spine of the argument", kind: "recap", Component: S23Recap, has3d: true, transition: "dolly" },
  { id: "demo", title: "The AI Era Console", kind: "demo", Component: S24Demo, has3d: true, transition: "dolly" },
  { id: "qa", title: "Over to you", kind: "qa", Component: S25QA, has3d: true, transition: "dolly" },
];
