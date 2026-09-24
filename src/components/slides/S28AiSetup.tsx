"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Bug,
  ChevronRight,
  FileText,
  FlaskConical,
  GitPullRequest,
  Lock,
  ScanEye,
  ShieldCheck,
  SquareKanban,
  Terminal,
  Ticket,
} from "lucide-react";
import { SlideShell } from "@/components/deck/SlideShell";
import { EASE_OUT, SPRING } from "@/lib/motion";

// Speaker-provided (SOURCE-NOTES Theme N). The plugin stays unnamed on purpose: it is private.
const INTEGRATIONS = [
  { id: "atlassian", label: "Jira / Confluence", cli: "acli · confluence", Icon: SquareKanban },
  { id: "git", label: "GitHub / GitLab", cli: "gh · glab", Icon: GitPullRequest },
  { id: "sonar", label: "SonarQube", cli: "sonacli", Icon: ShieldCheck },
  { id: "sentry", label: "Sentry", cli: "sentry-cli", Icon: Bug },
] as const;

type IntegrationId = (typeof INTEGRATIONS)[number]["id"];

// `uses` is which integrations each workflow leans on; hovering a workflow lights them.
const WORKFLOWS: {
  id: string;
  label: string;
  Icon: typeof Bug;
  uses: IntegrationId[];
  steps?: string[];
}[] = [
  { id: "review", label: "Auto PR reviewer", Icon: ScanEye, uses: ["git"] },
  { id: "tests", label: "Auto unit test generator", Icon: FlaskConical, uses: ["atlassian", "git"] },
  { id: "docs", label: "Specific-purpose doc generator", Icon: FileText, uses: ["atlassian"] },
  { id: "sentry-flow", label: "Sentry issue to PR", Icon: Bug, uses: ["sentry", "atlassian", "git"], steps: ["Sentry", "Jira", "Bugfix", "PR"] },
  { id: "sonar-flow", label: "SonarQube issue to PR", Icon: ShieldCheck, uses: ["sonar", "atlassian", "git"], steps: ["SonarQube", "Jira", "Bugfix", "PR"] },
  { id: "jira-flow", label: "Jira card to PR", Icon: Ticket, uses: ["atlassian", "git"], steps: ["Jira", "Develop", "PR"] },
];

const BAND_LABEL = "font-mono text-[11px] tracking-[0.16em] text-faint uppercase leading-snug";

export function S28AiSetup() {
  // Nothing selected at first so the stack reads as layers; hovering a workflow shows
  // which integrations it is built on. Sticky, like slide 13, so the speaker can talk over it.
  const [active, setActive] = useState<string | null>(null);
  const wf = WORKFLOWS.find((w) => w.id === active);

  return (
    <SlideShell
      kicker="Bonus · At Mamikos"
      title="How we use AI day to day"
      className="pt-12! [&>header]:mb-6"
    >
      {/* Read top-down as "built on": workflows → integrations → shared plugin → Claude Code.
          The entrance runs bottom-up so the foundation lands first. */}
      <div className="grid h-full grid-cols-[150px_1fr] content-center gap-x-6 gap-y-4">
        <motion.div
          className={`${BAND_LABEL} pt-3`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.95, duration: 0.5 }}
        >
          Workflow skills
          <span className="mt-1 block tracking-normal normal-case">automate the dev flow</span>
        </motion.div>
        <div className="grid grid-cols-3 gap-2.5">
          {WORKFLOWS.map((w, i) => {
            const on = active === w.id;
            return (
              <motion.button
                key={w.id}
                onMouseEnter={() => setActive(w.id)}
                onClick={() => setActive(on ? null : w.id)}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: active && !on ? 0.5 : 1, y: 0 }}
                transition={{
                  opacity: { duration: 0.25, delay: active ? 0 : 0.95 + i * 0.07 },
                  y: { ...SPRING, delay: 0.95 + i * 0.07 },
                }}
                className={`flex min-h-[74px] flex-col justify-center gap-2 rounded-xl border px-4 py-3 text-left transition-colors ${
                  on ? "border-accent bg-accent/10" : "border-line bg-surface hover:border-fg/25"
                }`}
              >
                <span className="flex items-center gap-2.5 text-[15px] font-medium">
                  <w.Icon size={16} className={on ? "text-accent" : "text-muted"} />
                  {w.label}
                </span>
                {w.steps ? (
                  <span className="flex flex-wrap items-center gap-1 font-mono text-[11px]">
                    {w.steps.map((s, si) => (
                      <span key={s} className="flex items-center gap-1">
                        <motion.span
                          animate={{ color: on ? "var(--accent)" : "var(--muted)" }}
                          transition={{ duration: 0.2, delay: on ? si * 0.12 : 0 }}
                        >
                          {s}
                        </motion.span>
                        {si < w.steps!.length - 1 ? (
                          <ChevronRight size={11} className="text-faint" />
                        ) : null}
                      </span>
                    ))}
                  </span>
                ) : null}
              </motion.button>
            );
          })}
        </div>

        <motion.div
          className={`${BAND_LABEL} pt-3`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Integration skills
          <span className="mt-1 block tracking-normal normal-case">raw CLI tools</span>
        </motion.div>
        <div className="grid grid-cols-4 gap-2.5">
          {INTEGRATIONS.map((t, i) => {
            const lit = wf?.uses.includes(t.id) ?? false;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: wf && !lit ? 0.4 : 1, y: 0 }}
                transition={{
                  opacity: { duration: 0.25, delay: wf ? 0 : 0.6 + i * 0.07 },
                  y: { ...SPRING, delay: 0.6 + i * 0.07 },
                }}
                className={`rounded-xl border px-4 py-3 transition-colors ${
                  lit ? "border-accent bg-accent/10" : "border-line bg-surface"
                }`}
              >
                <div className="flex items-center gap-2.5 text-[15px] font-medium">
                  <t.Icon size={16} className={lit ? "text-accent" : "text-muted"} />
                  {t.label}
                </div>
                <div className="mt-1 font-mono text-[12px] text-faint">{t.cli}</div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className={`${BAND_LABEL} self-center`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.5 }}
        >
          Shared harness
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE_OUT, delay: 0.45 }}
          className="flex items-center gap-3 rounded-xl border border-dashed border-fg/25 bg-surface-2 px-5 py-3"
        >
          <Lock size={16} className="text-muted" />
          <span className="text-[15px] font-medium">Private Claude plugin</span>
          <span className="ml-auto text-[13px] text-muted">
            shared across the team
          </span>
        </motion.div>

        <motion.div
          className={`${BAND_LABEL} self-center`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Runtime
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE_OUT, delay: 0.3 }}
          className="flex items-center gap-3 rounded-xl border border-line bg-surface-2 px-5 py-3"
        >
          <Terminal size={16} className="text-muted" />
          <span className="font-mono text-[15px] font-medium">Claude Code</span>
        </motion.div>
      </div>
    </SlideShell>
  );
}
