import {
  Bot,
  CircleDot,
  DollarSign,
  CheckSquare,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const metrics = [
  {
    label: "Agents Enabled",
    value: "4",
    sub: "2 active right now",
    icon: Bot,
    href: "/agents",
    trend: "+1 this week",
    trendUp: true,
  },
  {
    label: "Tasks In Progress",
    value: "12",
    sub: "across 3 projects",
    icon: CircleDot,
    href: "/issues",
    trend: "+3 today",
    trendUp: true,
  },
  {
    label: "Month Spend",
    value: "$284",
    sub: "of $500 budget",
    icon: DollarSign,
    href: "/costs",
    trend: "56.8% used",
    trendUp: false,
  },
  {
    label: "Pending Approvals",
    value: "3",
    sub: "awaiting your review",
    icon: CheckSquare,
    href: "/approvals",
    trend: "2 high priority",
    trendUp: false,
  },
];

const recentActivity = [
  {
    id: 1,
    agent: "Dev Agent",
    action: "Completed task",
    title: "Refactor authentication middleware",
    time: "2m ago",
    status: "completed",
  },
  {
    id: 2,
    agent: "QA Agent",
    action: "Started working on",
    title: "Write tests for payment service",
    time: "8m ago",
    status: "active",
  },
  {
    id: 3,
    agent: "Dev Agent",
    action: "Created PR for",
    title: "Fix race condition in job queue",
    time: "23m ago",
    status: "completed",
  },
  {
    id: 4,
    agent: "PM Agent",
    action: "Updated goal",
    title: "Q2 Infrastructure Milestone",
    time: "1h ago",
    status: "completed",
  },
  {
    id: 5,
    agent: "Docs Agent",
    action: "Failed on",
    title: "Generate API documentation",
    time: "2h ago",
    status: "error",
  },
  {
    id: 6,
    agent: "Dev Agent",
    action: "Deployed",
    title: "v2.3.1 to staging environment",
    time: "3h ago",
    status: "completed",
  },
];

const recentTasks = [
  {
    id: "ISS-142",
    title: "Implement rate limiting on API endpoints",
    agent: "Dev Agent",
    priority: "high",
    status: "in_progress",
  },
  {
    id: "ISS-141",
    title: "Update CI/CD pipeline for new deployment strategy",
    agent: "Dev Agent",
    priority: "medium",
    status: "in_progress",
  },
  {
    id: "ISS-140",
    title: "Audit user permissions and access controls",
    agent: "QA Agent",
    priority: "high",
    status: "in_review",
  },
  {
    id: "ISS-138",
    title: "Migrate legacy endpoints to new auth system",
    agent: "Dev Agent",
    priority: "medium",
    status: "completed",
  },
  {
    id: "ISS-136",
    title: "Set up monitoring dashboards",
    agent: "PM Agent",
    priority: "low",
    status: "completed",
  },
];

const barData = [
  { day: "Mon", runs: 8 },
  { day: "Tue", runs: 15 },
  { day: "Wed", runs: 12 },
  { day: "Thu", runs: 20 },
  { day: "Fri", runs: 18 },
  { day: "Sat", runs: 6 },
  { day: "Sun", runs: 9 },
  { day: "Mon", runs: 22 },
  { day: "Tue", runs: 17 },
  { day: "Wed", runs: 24 },
  { day: "Thu", runs: 19 },
  { day: "Fri", runs: 28 },
  { day: "Sat", runs: 11 },
  { day: "Sun", runs: 14 },
];

const maxRuns = Math.max(...barData.map((d) => d.runs));

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    case "active":
      return <Loader2 className="w-3.5 h-3.5 text-blue-400 shrink-0 animate-spin" />;
    case "error":
      return <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />;
    default:
      return <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />;
  }
}

function PriorityDot({ priority }: { priority: string }) {
  return (
    <span
      className={cn("w-1.5 h-1.5 rounded-full shrink-0", {
        "bg-red-400": priority === "high",
        "bg-yellow-400": priority === "medium",
        "bg-zinc-500": priority === "low",
      })}
    />
  );
}

function TaskStatus({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    in_progress: { label: "In Progress", cls: "text-blue-400 bg-blue-400/10" },
    in_review: { label: "In Review", cls: "text-yellow-400 bg-yellow-400/10" },
    completed: { label: "Done", cls: "text-emerald-400 bg-emerald-400/10" },
  };
  const s = map[status] ?? { label: status, cls: "text-muted-foreground bg-muted" };
  return (
    <span className={cn("text-xs px-1.5 py-0.5 rounded-sm font-medium", s.cls)}>
      {s.label}
    </span>
  );
}

export default function DashboardPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Acme Corp · Last updated just now
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-pulse" />
            2 agents running
          </span>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map((m) => (
          <Link
            key={m.label}
            href={m.href}
            className="bg-card border border-border p-4 hover:border-border/80 hover:bg-card/80 transition-colors group"
          >
            <div className="flex items-start justify-between mb-3">
              <m.icon className="w-4 h-4 text-muted-foreground" />
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/0 group-hover:text-muted-foreground/50 transition-colors" />
            </div>
            <div className="text-2xl font-semibold text-foreground mb-0.5">
              {m.value}
            </div>
            <div className="text-xs text-muted-foreground mb-1">{m.sub}</div>
            <div
              className={cn("text-xs flex items-center gap-1", {
                "text-emerald-400": m.trendUp,
                "text-muted-foreground": !m.trendUp,
              })}
            >
              {m.trendUp && <TrendingUp className="w-3 h-3" />}
              {m.trend}
            </div>
          </Link>
        ))}
      </div>

      {/* Alert banner */}
      <div className="flex items-center gap-3 border border-yellow-500/30 bg-yellow-500/5 px-4 py-3 text-sm">
        <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0" />
        <span className="text-yellow-200/80">
          <strong className="text-yellow-300">Docs Agent</strong> encountered an error on the last run.{" "}
          <Link href="/agents" className="underline underline-offset-2 hover:text-yellow-200">
            View details →
          </Link>
        </span>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Run activity bar chart */}
        <div className="lg:col-span-2 bg-card border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-medium text-foreground">Run Activity</div>
              <div className="text-xs text-muted-foreground">Last 14 days</div>
            </div>
            <Activity className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex items-end gap-1 h-32">
            {barData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-chart-5/80 hover:bg-chart-5 transition-colors"
                  style={{ height: `${(d.runs / maxRuns) * 100}%` }}
                />
                <span className="text-[9px] text-muted-foreground/50">
                  {i % 2 === 0 ? d.day : ""}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Issue priority breakdown */}
        <div className="bg-card border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-medium text-foreground">Issues by Priority</div>
              <div className="text-xs text-muted-foreground">Current sprint</div>
            </div>
          </div>
          <div className="space-y-2.5">
            {[
              { label: "High", count: 5, total: 12, color: "bg-red-400" },
              { label: "Medium", count: 4, total: 12, color: "bg-yellow-400" },
              { label: "Low", count: 3, total: 12, color: "bg-zinc-500" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>{item.label}</span>
                  <span>{item.count}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full", item.color)}
                    style={{ width: `${(item.count / item.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <div className="text-sm font-medium text-foreground mb-3">Status</div>
            <div className="space-y-2">
              {[
                { label: "In Progress", count: 6, color: "text-blue-400" },
                { label: "In Review", count: 3, color: "text-yellow-400" },
                { label: "Done", count: 14, color: "text-emerald-400" },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between text-xs">
                  <span className={cn("font-medium", s.color)}>{s.label}</span>
                  <span className="text-muted-foreground">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Recent Activity */}
        <div className="bg-card border border-border">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-sm font-medium">Recent Activity</span>
            <Link
              href="/activity"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-3 px-4 py-3">
                <StatusIcon status={item.status} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">
                    <span className="text-foreground font-medium">{item.agent}</span>{" "}
                    {item.action}
                  </p>
                  <p className="text-sm text-foreground truncate">{item.title}</p>
                </div>
                <span className="text-xs text-muted-foreground/60 shrink-0 whitespace-nowrap">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-card border border-border">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-sm font-medium">Recent Tasks</span>
            <Link
              href="/issues"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentTasks.map((task) => (
              <div key={task.id} className="flex items-start gap-3 px-4 py-3">
                <PriorityDot priority={task.priority} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs text-muted-foreground font-mono">
                      {task.id}
                    </span>
                    <TaskStatus status={task.status} />
                  </div>
                  <p className="text-sm text-foreground truncate">{task.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{task.agent}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
