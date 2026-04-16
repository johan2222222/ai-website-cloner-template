"use client";

import { useState } from "react";
import {
  Target,
  Plus,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Loader2,
  Clock,
  Bot,
  TrendingUp,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NewGoalModal } from "@/components/platform/Modals";

const GOALS = [
  {
    id: "goal-1",
    title: "Q2 Infrastructure Reliability",
    description: "Achieve 99.9% uptime and reduce P95 latency to under 200ms",
    status: "in_progress" as const,
    progress: 68,
    owner: "Dev Agent",
    dueDate: "Jun 30, 2025",
    priority: "high",
    tasks: [
      { id: "t1", title: "Implement circuit breakers", status: "completed", agent: "Dev Agent" },
      { id: "t2", title: "Set up Redis caching layer", status: "completed", agent: "Dev Agent" },
      { id: "t3", title: "Optimize slow database queries", status: "in_progress", agent: "Dev Agent" },
      { id: "t4", title: "Configure auto-scaling rules", status: "in_progress", agent: "PM Agent" },
      { id: "t5", title: "Load testing & benchmarking", status: "pending", agent: "QA Agent" },
    ],
  },
  {
    id: "goal-2",
    title: "Security Audit & Hardening",
    description: "Complete full security audit and remediate all high/critical findings",
    status: "in_progress" as const,
    progress: 42,
    owner: "QA Agent",
    dueDate: "May 31, 2025",
    priority: "high",
    tasks: [
      { id: "t6", title: "Audit user permissions", status: "in_progress", agent: "QA Agent" },
      { id: "t7", title: "Implement rate limiting", status: "in_progress", agent: "Dev Agent" },
      { id: "t8", title: "Add OAuth2 PKCE for mobile", status: "in_progress", agent: "Dev Agent" },
      { id: "t9", title: "Penetration testing", status: "pending", agent: "QA Agent" },
    ],
  },
  {
    id: "goal-3",
    title: "Mobile App v2.0 Launch",
    description: "Ship iOS and Android v2.0 with push notifications and offline mode",
    status: "in_progress" as const,
    progress: 30,
    owner: "Dev Agent",
    dueDate: "Jul 15, 2025",
    priority: "medium",
    tasks: [
      { id: "t10", title: "Push notifications (iOS + Android)", status: "in_progress", agent: "Dev Agent" },
      { id: "t11", title: "Offline data sync", status: "pending", agent: "Dev Agent" },
      { id: "t12", title: "UI redesign", status: "pending", agent: "PM Agent" },
    ],
  },
  {
    id: "goal-4",
    title: "Developer Documentation Overhaul",
    description: "Rebuild docs from scratch with interactive examples and API reference",
    status: "error" as const,
    progress: 15,
    owner: "Docs Agent",
    dueDate: "Jun 15, 2025",
    priority: "low",
    tasks: [
      { id: "t13", title: "Generate API docs from spec", status: "error", agent: "Docs Agent" },
      { id: "t14", title: "Write quickstart guide", status: "pending", agent: "Docs Agent" },
    ],
  },
  {
    id: "goal-5",
    title: "Reduce Infrastructure Costs by 20%",
    description: "Optimize cloud spending through right-sizing and reserved instances",
    status: "completed" as const,
    progress: 100,
    owner: "PM Agent",
    dueDate: "Apr 30, 2025",
    priority: "medium",
    tasks: [
      { id: "t15", title: "Audit current cloud spend", status: "completed", agent: "PM Agent" },
      { id: "t16", title: "Right-size EC2 instances", status: "completed", agent: "Dev Agent" },
      { id: "t17", title: "Set up Grafana cost monitoring", status: "completed", agent: "PM Agent" },
    ],
  },
];

type Goal = (typeof GOALS)[0];

function ProgressBar({ value, status }: { value: number; status: string }) {
  return (
    <div className="h-1.5 bg-muted overflow-hidden w-full">
      <div
        className={cn("h-full transition-all", {
          "bg-emerald-400": status === "completed",
          "bg-chart-5": status === "in_progress",
          "bg-red-400": status === "error",
          "bg-muted-foreground": status === "pending",
        })}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
    in_progress: {
      label: "In Progress",
      cls: "text-blue-400 bg-blue-400/10",
      icon: <Loader2 className="w-3 h-3 animate-spin" />,
    },
    completed: {
      label: "Done",
      cls: "text-emerald-400 bg-emerald-400/10",
      icon: <CheckCircle2 className="w-3 h-3" />,
    },
    error: {
      label: "Blocked",
      cls: "text-red-400 bg-red-400/10",
      icon: <Clock className="w-3 h-3" />,
    },
    pending: {
      label: "Pending",
      cls: "text-muted-foreground bg-muted",
      icon: <Clock className="w-3 h-3" />,
    },
  };
  const s = map[status] ?? map.pending;
  return (
    <span className={cn("flex items-center gap-1 text-xs px-2 py-0.5 font-medium", s.cls)}>
      {s.icon}
      {s.label}
    </span>
  );
}

function GoalCard({ goal }: { goal: Goal }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-card border border-border hover:border-border/70 transition-colors">
      <div
        className="flex items-start gap-3 px-4 py-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <button className="mt-0.5 text-muted-foreground hover:text-foreground transition-colors">
          {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-foreground">{goal.title}</span>
                <StatusBadge status={goal.status} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{goal.description}</p>
            </div>
            <button className="p-1 text-muted-foreground hover:text-foreground shrink-0">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{goal.progress}% complete</span>
              <span className="text-muted-foreground/60">Due {goal.dueDate}</span>
            </div>
            <ProgressBar value={goal.progress} status={goal.status} />
          </div>

          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Bot className="w-3 h-3" />
              {goal.owner}
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {goal.tasks.filter((t) => t.status === "completed").length}/
              {goal.tasks.length} tasks
            </span>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border">
          <div className="px-4 py-1.5 bg-muted/20 text-xs text-muted-foreground">
            Tasks ({goal.tasks.length})
          </div>
          <div className="divide-y divide-border">
            {goal.tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 px-4 py-2.5">
                <span className="ml-5">
                  {task.status === "completed" ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : task.status === "in_progress" ? (
                    <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                  ) : task.status === "error" ? (
                    <Clock className="w-3.5 h-3.5 text-red-400" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-muted-foreground/40" />
                  )}
                </span>
                <span
                  className={cn("flex-1 text-sm", {
                    "text-muted-foreground line-through": task.status === "completed",
                    "text-foreground": task.status !== "completed",
                  })}
                >
                  {task.title}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Bot className="w-3 h-3" />
                  {task.agent}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(GOALS);
  const [modalOpen, setModalOpen] = useState(false);

  const completed = goals.filter((g) => g.status === "completed").length;
  const inProgress = goals.filter((g) => g.status === "in_progress").length;
  const avgProgress = goals.length > 0
    ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length)
    : 0;

  return (
    <div className="h-full flex flex-col">
      <NewGoalModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(form) =>
          setGoals((prev) => [
            ...prev,
            {
              id: `goal-${prev.length + 1}`,
              title: form.title,
              description: form.description,
              status: "in_progress" as const,
              progress: 0,
              owner: form.owner,
              dueDate: form.dueDate || "TBD",
              priority: form.priority,
              tasks: [],
            },
          ])
        }
      />

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <Target className="w-4 h-4 text-muted-foreground" />
          <h1 className="text-sm font-semibold">Goals</h1>
          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5">
              {completed} done
            </span>
            <span className="text-xs text-blue-400 bg-blue-400/10 px-1.5 py-0.5">
              {inProgress} active
            </span>
          </div>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 text-xs bg-primary text-primary-foreground px-3 py-1.5 hover:bg-primary/90 transition-colors font-medium"
        >
          <Plus className="w-3.5 h-3.5" />
          New Goal
        </button>
      </div>

      {/* Overall progress */}
      <div className="px-6 py-3 border-b border-border shrink-0 bg-muted/10">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
          <span>Overall progress</span>
          <span>
            {avgProgress}% across {goals.length} goals
          </span>
        </div>
        <div className="h-1.5 bg-muted overflow-hidden">
          <div
            className="h-full bg-chart-5"
            style={{ width: `${avgProgress}%` }}
          />
        </div>
      </div>

      {/* Goal list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
    </div>
  );
}
