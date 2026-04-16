"use client";

import { useState } from "react";
import { History, Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ActivityType = "run" | "error" | "approval" | "budget" | "status";

type ActivityEntry = {
  id: number;
  type: ActivityType;
  agent: string;
  action: string;
  detail: string;
  time: string;
  status?: string;
};

const ENTRIES: ActivityEntry[] = [
  { id: 1,  type: "run",      agent: "Dev Agent",    action: "completed run #289",        detail: "Implementing OAuth2 PKCE flow — 23 files changed",          time: "2m ago",  status: "success"  },
  { id: 2,  type: "run",      agent: "QA Agent",     action: "started run #88",           detail: "Writing tests for payment service",                          time: "8m ago",  status: "running"  },
  { id: 3,  type: "approval", agent: "Dev Agent",    action: "requested approval",        detail: "Deploy v2.3.1 to production",                               time: "10m ago", status: "pending"  },
  { id: 4,  type: "run",      agent: "Dev Agent",    action: "completed run #288",        detail: "Fix race condition in job queue — 4 files changed",          time: "23m ago", status: "success"  },
  { id: 5,  type: "error",    agent: "Docs Agent",   action: "failed run #13",            detail: "Error: EACCES permission denied on /srv/api/openapi.json",   time: "1h ago",  status: "error"    },
  { id: 6,  type: "budget",   agent: "Dev Agent",    action: "reached 80% budget",        detail: "$120.00 of $150.00 budget used this month",                  time: "2h ago",  status: "warning"  },
  { id: 7,  type: "run",      agent: "PM Agent",     action: "completed run #32",         detail: "Sprint planning — 12 issues prioritized",                   time: "2h ago",  status: "success"  },
  { id: 8,  type: "approval", agent: "PM Agent",     action: "approval approved",         detail: "Install zod@3.22.4 — approved by you",                      time: "3h ago",  status: "approved" },
  { id: 9,  type: "status",   agent: "PM Agent",     action: "status changed to paused",  detail: "Manually paused via dashboard",                             time: "4h ago",  status: "paused"   },
  { id: 10, type: "run",      agent: "Dev Agent",    action: "completed run #287",        detail: "Update CI/CD pipeline — 8 files changed",                   time: "5h ago",  status: "success"  },
  { id: 11, type: "run",      agent: "QA Agent",     action: "completed run #87",         detail: "Security audit — 0 critical issues found",                  time: "6h ago",  status: "success"  },
  { id: 12, type: "error",    agent: "Deploy Agent", action: "failed run #21",            detail: "Timeout: staging deployment exceeded 10m limit",             time: "8h ago",  status: "error"    },
  { id: 13, type: "approval", agent: "Dev Agent",    action: "approval rejected",         detail: "Send marketing email — rejected by you",                    time: "10h ago", status: "rejected" },
  { id: 14, type: "run",      agent: "Dev Agent",    action: "completed run #286",        detail: "Implement rate limiting on API — 12 files changed",          time: "12h ago", status: "success"  },
  { id: 15, type: "budget",   agent: "QA Agent",     action: "reached 60% budget",        detail: "$60.00 of $100.00 budget used this month",                  time: "1d ago",  status: "warning"  },
  { id: 16, type: "run",      agent: "Dev Agent",    action: "completed run #285",        detail: "Refactor auth middleware — 7 files changed",                 time: "1d ago",  status: "success"  },
  { id: 17, type: "status",   agent: "Docs Agent",   action: "status changed to error",   detail: "Automatic — last run failed with exit code 1",              time: "1d ago",  status: "error"    },
  { id: 18, type: "run",      agent: "PM Agent",     action: "completed run #31",         detail: "Backlog grooming — 8 issues updated",                       time: "2d ago",  status: "success"  },
  { id: 19, type: "approval", agent: "Dev Agent",    action: "requested approval",        detail: "Delete deprecated /v1/users endpoint",                      time: "2d ago",  status: "pending"  },
  { id: 20, type: "run",      agent: "QA Agent",     action: "completed run #86",         detail: "Week 15 coverage report generated",                         time: "2d ago",  status: "success"  },
  { id: 21, type: "run",      agent: "Deploy Agent", action: "completed run #20",         detail: "Deploy v2.2.8 to production — success",                     time: "3d ago",  status: "success"  },
  { id: 22, type: "budget",   agent: "PM Agent",     action: "reached 50% budget",        detail: "$40.00 of $80.00 budget used",                              time: "3d ago",  status: "warning"  },
  { id: 23, type: "run",      agent: "Dev Agent",    action: "completed run #284",        detail: "Migrate legacy endpoints to auth v2",                       time: "4d ago",  status: "success"  },
  { id: 24, type: "status",   agent: "Deploy Agent", action: "status changed to paused",  detail: "Manually paused — deployment window closed",                time: "5d ago",  status: "paused"   },
  { id: 25, type: "run",      agent: "Dev Agent",    action: "completed run #283",        detail: "Set up Grafana monitoring dashboards",                      time: "5d ago",  status: "success"  },
];

type TabKey = "all" | ActivityType;

const TABS: { key: TabKey; label: string }[] = [
  { key: "all",      label: "All"       },
  { key: "run",      label: "Runs"      },
  { key: "error",    label: "Errors"    },
  { key: "approval", label: "Approvals" },
  { key: "budget",   label: "Budget"    },
];

const TYPE_DOT_COLOR: Record<ActivityType, string> = {
  run:      "bg-blue-400",
  error:    "bg-red-400",
  approval: "bg-violet-400",
  budget:   "bg-yellow-400",
  status:   "bg-zinc-400",
};

const TYPE_BORDER_COLOR: Record<ActivityType, string> = {
  run:      "border-l-blue-400",
  error:    "border-l-red-400",
  approval: "border-l-violet-400",
  budget:   "border-l-yellow-400",
  status:   "border-l-zinc-400",
};

const STATUS_BADGE: Record<string, string> = {
  success:  "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  running:  "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  error:    "bg-red-500/15 text-red-400 border border-red-500/30",
  warning:  "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
  pending:  "bg-zinc-500/15 text-zinc-400 border border-zinc-500/30",
  approved: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  rejected: "bg-red-500/15 text-red-400 border border-red-500/30",
  paused:   "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
};

function StatusBadge({ status }: { status?: string }) {
  if (!status) return null;
  const cls = STATUS_BADGE[status] ?? "bg-zinc-500/15 text-zinc-400 border border-zinc-500/30";
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium", cls)}>
      {status === "running" && <Loader2 className="h-3 w-3 animate-spin" />}
      {status}
    </span>
  );
}

export default function ActivityPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const countFor = (key: TabKey) =>
    key === "all" ? ENTRIES.length : ENTRIES.filter((e) => e.type === key).length;

  const filtered =
    activeTab === "all" ? ENTRIES : ENTRIES.filter((e) => e.type === activeTab);

  return (
    <div className="flex h-full flex-col bg-background">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <History className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-base font-semibold text-foreground">Activity</h1>
          <span className="text-sm text-muted-foreground">Apr 1 – Apr 16, 2025</span>
        </div>
        <button
          onClick={() => window.alert("Exported to CSV")}
          className="flex items-center gap-2 border border-border bg-card px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-accent/50"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* ── Filter tabs ────────────────────────────────────── */}
      <div className="flex shrink-0 items-center gap-0 border-b border-border px-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2.5 text-sm transition-colors",
              activeTab === tab.key
                ? "-mb-px border-b-2 border-foreground bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            <span
              className={cn(
                "inline-flex h-4 min-w-[1rem] items-center justify-center px-1 text-xs",
                activeTab === tab.key
                  ? "bg-foreground/15 text-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {countFor(tab.key)}
            </span>
          </button>
        ))}
      </div>

      {/* ── Timeline ───────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map((entry) => (
          <div
            key={entry.id}
            className={cn(
              "flex gap-4 border-b border-border border-l-2 px-6 py-3 transition-colors hover:bg-muted/10",
              TYPE_BORDER_COLOR[entry.type]
            )}
          >
            {/* Colored dot */}
            <div className="mt-1.5 shrink-0">
              <span className={cn("block h-2 w-2 rounded-full", TYPE_DOT_COLOR[entry.type])} />
            </div>

            {/* Main content */}
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-snug text-foreground">
                <span className="font-medium">{entry.agent}</span>{" "}
                <span className="text-muted-foreground">{entry.action}</span>
              </p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{entry.detail}</p>
            </div>

            {/* Time + badge */}
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <span className="whitespace-nowrap text-xs text-muted-foreground">{entry.time}</span>
              <StatusBadge status={entry.status} />
            </div>
          </div>
        ))}

        {/* Load more */}
        <div className="flex justify-center py-6">
          <button
            onClick={() => window.alert("All entries loaded")}
            className="border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
          >
            Load more
          </button>
        </div>
      </div>
    </div>
  );
}
