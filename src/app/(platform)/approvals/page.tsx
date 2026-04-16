"use client";

import { useState } from "react";
import { CheckSquare, Bot, Clock, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const APPROVALS = [
  {
    id: "apr-1",
    title: "Deploy v2.3.1 to production",
    agent: "Dev Agent",
    description: "Ready to deploy after all tests pass. Includes OAuth2 PKCE and rate limiting.",
    priority: "high",
    requestedAt: "10m ago",
    status: "pending",
    type: "deploy",
  },
  {
    id: "apr-2",
    title: "Increase monthly budget for Dev Agent to $200",
    agent: "PM Agent",
    description: "Dev Agent hitting budget limits. Recommending $50 increase for upcoming sprint.",
    priority: "medium",
    requestedAt: "1h ago",
    status: "pending",
    type: "budget",
  },
  {
    id: "apr-3",
    title: "Delete deprecated /v1/users endpoint",
    agent: "Dev Agent",
    description: "All clients migrated to v2. Safe to remove legacy endpoint.",
    priority: "low",
    requestedAt: "3h ago",
    status: "pending",
    type: "code",
  },
  {
    id: "apr-4",
    title: "Install new npm package: zod@3.22.4",
    agent: "Dev Agent",
    description: "Needed for runtime type validation in the new API layer.",
    priority: "low",
    requestedAt: "1d ago",
    status: "approved",
    type: "package",
  },
  {
    id: "apr-5",
    title: "Send marketing email to 5,000 users",
    agent: "PM Agent",
    description: "Announce new features in v2.3. Draft has been reviewed.",
    priority: "high",
    requestedAt: "2d ago",
    status: "rejected",
    type: "action",
  },
];

type Approval = (typeof APPROVALS)[0];

const typeColors: Record<string, string> = {
  deploy: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  budget: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  code: "text-violet-400 bg-violet-400/10 border-violet-400/20",
  package: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  action: "text-orange-400 bg-orange-400/10 border-orange-400/20",
};

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<Approval[]>(APPROVALS);
  const [toast, setToast] = useState<string | null>(null);

  const handleApproval = (id: string, action: "approved" | "rejected") => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: action } : a))
    );
    setToast(action === "approved" ? "✓ Approved" : "✗ Rejected");
    setTimeout(() => setToast(null), 2000);
  };

  const pending = approvals.filter((a) => a.status === "pending");

  return (
    <div className="h-full flex flex-col">
      {toast !== null && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2 text-sm font-medium bg-card border border-border shadow-lg">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <CheckSquare className="w-4 h-4 text-muted-foreground" />
          <h1 className="text-sm font-semibold">Approvals</h1>
          {pending.length > 0 && (
            <span className="text-xs text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5">
              {pending.length} pending
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {approvals.map((apr) => (
          <div
            key={apr.id}
            className={cn(
              "bg-card border p-4",
              apr.status === "pending"
                ? "border-border hover:border-border/70"
                : "border-border/50 opacity-70"
            )}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.5 border font-medium uppercase tracking-wide",
                      typeColors[apr.type]
                    )}
                  >
                    {apr.type}
                  </span>
                  {apr.priority === "high" && (
                    <span className="flex items-center gap-1 text-[10px] text-red-400">
                      <AlertTriangle className="w-2.5 h-2.5" />
                      High priority
                    </span>
                  )}
                  {apr.status !== "pending" && (
                    <span
                      className={cn(
                        "text-[10px] px-1.5 py-0.5 font-medium",
                        apr.status === "approved"
                          ? "text-emerald-400 bg-emerald-400/10"
                          : "text-red-400 bg-red-400/10"
                      )}
                    >
                      {apr.status === "approved" ? "Approved" : "Rejected"}
                    </span>
                  )}
                </div>
                <div className="text-sm font-medium text-foreground">{apr.title}</div>
                <p className="text-xs text-muted-foreground mt-1">{apr.description}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Bot className="w-3 h-3" />
                    {apr.agent}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {apr.requestedAt}
                  </span>
                </div>
              </div>
              {apr.status === "pending" && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleApproval(apr.id, "approved")}
                    className="flex items-center gap-1.5 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 hover:bg-emerald-500/20 transition-colors font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval(apr.id, "rejected")}
                    className="flex items-center gap-1.5 text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 hover:bg-red-500/20 transition-colors font-medium"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
