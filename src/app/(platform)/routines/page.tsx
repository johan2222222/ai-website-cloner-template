"use client";

import { useState } from "react";
import { Repeat2, Plus, Clock, Bot, ChevronRight, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { NewRoutineModal } from "@/components/platform/Modals";

const ROUTINES = [
  {
    id: "r1",
    name: "Daily code review",
    description: "Review open PRs and leave comments",
    agent: "Dev Agent",
    schedule: "Every day at 9:00 AM",
    lastRun: "Today, 9:02 AM",
    nextRun: "Tomorrow, 9:00 AM",
    status: "active" as const,
    runsTotal: 47,
    avgDuration: "12m",
  },
  {
    id: "r2",
    name: "Weekly test report",
    description: "Run full test suite and generate coverage report",
    agent: "QA Agent",
    schedule: "Every Monday at 8:00 AM",
    lastRun: "Mon Apr 14, 8:04 AM",
    nextRun: "Mon Apr 21, 8:00 AM",
    status: "active" as const,
    runsTotal: 12,
    avgDuration: "34m",
  },
  {
    id: "r3",
    name: "Sprint planning prep",
    description: "Triage backlog, estimate issues, prepare sprint board",
    agent: "PM Agent",
    schedule: "Every 2 weeks on Monday",
    lastRun: "Mon Apr 7, 10:00 AM",
    nextRun: "Mon Apr 21, 10:00 AM",
    status: "paused" as const,
    runsTotal: 8,
    avgDuration: "45m",
  },
  {
    id: "r4",
    name: "Security dependency scan",
    description: "Run npm audit and update vulnerable packages",
    agent: "Dev Agent",
    schedule: "Every Sunday at midnight",
    lastRun: "Sun Apr 13, 12:01 AM",
    nextRun: "Sun Apr 20, 12:00 AM",
    status: "active" as const,
    runsTotal: 18,
    avgDuration: "8m",
  },
  {
    id: "r5",
    name: "Changelog generation",
    description: "Generate changelog from merged PRs and update docs",
    agent: "Docs Agent",
    schedule: "Every Friday at 5:00 PM",
    lastRun: "Fri Apr 11, 5:03 PM",
    nextRun: "Fri Apr 18, 5:00 PM",
    status: "paused" as const,
    runsTotal: 6,
    avgDuration: "7m",
  },
];

type Routine = (typeof ROUTINES)[0];

export default function RoutinesPage() {
  const [routines, setRoutines] = useState<Routine[]>(ROUTINES);
  const [modalOpen, setModalOpen] = useState(false);

  const toggleRoutine = (id: string) =>
    setRoutines((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: r.status === "active" ? ("paused" as const) : ("active" as const) }
          : r
      )
    );

  return (
    <div className="h-full flex flex-col">
      <NewRoutineModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(form) =>
          setRoutines((prev) => [
            ...prev,
            {
              id: `r${prev.length + 1}`,
              name: form.name,
              description: form.description,
              agent: form.agent,
              schedule: form.schedule,
              lastRun: "never",
              nextRun: "scheduled",
              status: "active" as const,
              runsTotal: 0,
              avgDuration: "—",
            },
          ])
        }
      />

      <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <Repeat2 className="w-4 h-4 text-muted-foreground" />
          <h1 className="text-sm font-semibold">Routines</h1>
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5">
            {routines.length}
          </span>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 text-xs bg-primary text-primary-foreground px-3 py-1.5 hover:bg-primary/90 transition-colors font-medium"
        >
          <Plus className="w-3.5 h-3.5" />
          New Routine
        </button>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-border">
        {routines.map((r) => (
          <div
            key={r.id}
            className="flex items-start gap-4 px-6 py-4 hover:bg-muted/20 transition-colors cursor-pointer group"
          >
            <div
              className={cn("mt-1 w-2 h-2 rounded-full shrink-0", {
                "bg-emerald-400": r.status === "active",
                "bg-yellow-400": r.status === "paused",
              })}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-foreground">{r.name}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground/0 group-hover:text-muted-foreground/50 transition-colors" />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{r.description}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Bot className="w-3 h-3" />
                  {r.agent}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {r.schedule}
                </span>
                <span>Last: {r.lastRun}</span>
                <span>Next: {r.nextRun}</span>
                <span>{r.runsTotal} total runs · avg {r.avgDuration}</span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleRoutine(r.id);
              }}
              className={cn(
                "mt-1 p-1.5 border transition-colors text-muted-foreground hover:text-foreground",
                r.status === "active"
                  ? "hover:bg-yellow-400/10 hover:border-yellow-400/20"
                  : "hover:bg-emerald-400/10 hover:border-emerald-400/20"
              )}
            >
              {r.status === "active" ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
