"use client";

import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Bot,
  AlertTriangle,
  BarChart2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const AGENT_COSTS = [
  {
    id: "agt-1",
    name: "Dev Agent",
    role: "Senior Software Engineer",
    monthBudget: 150,
    monthSpend: 84.5,
    lastMonthSpend: 71.2,
    runs: 142,
    avgCostPerRun: 0.59,
    breakdown: { input: 34.2, output: 50.3 },
  },
  {
    id: "agt-2",
    name: "QA Agent",
    role: "QA Engineer",
    monthBudget: 100,
    monthSpend: 42.2,
    lastMonthSpend: 38.5,
    runs: 78,
    avgCostPerRun: 0.54,
    breakdown: { input: 18.1, output: 24.1 },
  },
  {
    id: "agt-3",
    name: "PM Agent",
    role: "Product Manager",
    monthBudget: 80,
    monthSpend: 18.0,
    lastMonthSpend: 22.3,
    runs: 31,
    avgCostPerRun: 0.58,
    breakdown: { input: 7.8, output: 10.2 },
  },
  {
    id: "agt-4",
    name: "Docs Agent",
    role: "Technical Writer",
    monthBudget: 50,
    monthSpend: 6.8,
    lastMonthSpend: 14.1,
    runs: 12,
    avgCostPerRun: 0.57,
    breakdown: { input: 2.9, output: 3.9 },
  },
  {
    id: "agt-5",
    name: "Deploy Agent",
    role: "DevOps Engineer",
    monthBudget: 120,
    monthSpend: 31.1,
    lastMonthSpend: 28.9,
    runs: 54,
    avgCostPerRun: 0.58,
    breakdown: { input: 13.2, output: 17.9 },
  },
];

const DAILY_SPEND = [
  { day: "Apr 1", amount: 4.2 },
  { day: "Apr 2", amount: 8.1 },
  { day: "Apr 3", amount: 6.5 },
  { day: "Apr 4", amount: 11.2 },
  { day: "Apr 5", amount: 9.8 },
  { day: "Apr 6", amount: 3.1 },
  { day: "Apr 7", amount: 5.4 },
  { day: "Apr 8", amount: 12.3 },
  { day: "Apr 9", amount: 10.7 },
  { day: "Apr 10", amount: 8.9 },
  { day: "Apr 11", amount: 14.2 },
  { day: "Apr 12", amount: 11.5 },
  { day: "Apr 13", amount: 7.2 },
  { day: "Apr 14", amount: 9.3 },
];

const totalBudget = AGENT_COSTS.reduce((a, c) => a + c.monthBudget, 0);
const totalSpend = AGENT_COSTS.reduce((a, c) => a + c.monthSpend, 0);
const lastMonthTotal = AGENT_COSTS.reduce((a, c) => a + c.lastMonthSpend, 0);
const maxDaily = Math.max(...DAILY_SPEND.map((d) => d.amount));

function BudgetBar({
  spend,
  budget,
  size = "md",
}: {
  spend: number;
  budget: number;
  size?: "sm" | "md";
}) {
  const pct = Math.min((spend / budget) * 100, 100);
  const danger = pct > 80;
  const warn = pct > 60 && !danger;
  return (
    <div className="flex items-center gap-2 w-full">
      <div
        className={cn("overflow-hidden bg-muted", size === "sm" ? "h-1" : "h-1.5", "flex-1")}
      >
        <div
          className={cn("h-full transition-all", {
            "bg-red-400": danger,
            "bg-yellow-400": warn,
            "bg-chart-5": !danger && !warn,
          })}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function CostsPage() {
  const changePercent = ((totalSpend - lastMonthTotal) / lastMonthTotal) * 100;
  const remaining = totalBudget - totalSpend;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <DollarSign className="w-4 h-4 text-muted-foreground" />
          <h1 className="text-sm font-semibold">Costs</h1>
          <span className="text-xs text-muted-foreground">April 2025</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: "Month Spend",
              value: `$${totalSpend.toFixed(2)}`,
              sub: `of $${totalBudget} budget`,
              icon: DollarSign,
              accent: false,
            },
            {
              label: "Remaining",
              value: `$${remaining.toFixed(2)}`,
              sub: `${Math.round((remaining / totalBudget) * 100)}% left`,
              icon: BarChart2,
              accent: false,
            },
            {
              label: "vs Last Month",
              value: `${changePercent > 0 ? "+" : ""}${changePercent.toFixed(1)}%`,
              sub: `was $${lastMonthTotal.toFixed(2)}`,
              icon: changePercent > 0 ? TrendingUp : TrendingDown,
              accent: changePercent > 10,
            },
            {
              label: "Total Runs",
              value: AGENT_COSTS.reduce((a, c) => a + c.runs, 0).toString(),
              sub: "this month",
              icon: Bot,
              accent: false,
            },
          ].map((card) => (
            <div key={card.label} className="bg-card border border-border p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">{card.label}</span>
                <card.icon
                  className={cn(
                    "w-4 h-4",
                    card.accent ? "text-yellow-400" : "text-muted-foreground"
                  )}
                />
              </div>
              <div
                className={cn(
                  "text-2xl font-semibold",
                  card.accent ? "text-yellow-300" : "text-foreground"
                )}
              >
                {card.value}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{card.sub}</div>
            </div>
          ))}
        </div>

        {/* Alert if near budget */}
        {totalSpend / totalBudget > 0.5 && (
          <div className="flex items-center gap-3 border border-yellow-500/30 bg-yellow-500/5 px-4 py-3 text-sm">
            <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0" />
            <span className="text-yellow-200/80">
              You've used{" "}
              <strong className="text-yellow-300">
                {Math.round((totalSpend / totalBudget) * 100)}%
              </strong>{" "}
              of your monthly budget. 15 days remaining.
            </span>
          </div>
        )}

        {/* Daily spend chart */}
        <div className="bg-card border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-medium">Daily Spend</div>
              <div className="text-xs text-muted-foreground">April 2025</div>
            </div>
            <span className="text-xs text-muted-foreground">
              Avg ${(totalSpend / DAILY_SPEND.length).toFixed(2)}/day
            </span>
          </div>
          <div className="flex items-end gap-1.5 h-28">
            {DAILY_SPEND.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="relative w-full">
                  <div
                    className="w-full bg-chart-5/60 hover:bg-chart-5 transition-colors cursor-default"
                    style={{ height: `${(d.amount / maxDaily) * 100}px` }}
                  />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-popover border border-border px-1.5 py-0.5 text-[10px] text-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    ${d.amount}
                  </div>
                </div>
                <span className="text-[9px] text-muted-foreground/40 hidden sm:block">
                  {i % 3 === 0 ? d.day.split(" ")[1] : ""}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Per-agent breakdown */}
        <div className="bg-card border border-border">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-sm font-medium">Agent Breakdown</span>
            <span className="text-xs text-muted-foreground">This month</span>
          </div>
          <div className="divide-y divide-border">
            {/* Column header */}
            <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-4 py-2 text-xs text-muted-foreground bg-muted/20">
              <span>Agent</span>
              <span className="w-20 text-right">Spend</span>
              <span className="w-16 text-right">Runs</span>
              <span className="w-20 text-right">Avg/run</span>
              <span className="w-36">Budget</span>
            </div>
            {AGENT_COSTS.map((agent) => {
              const pct = (agent.monthSpend / agent.monthBudget) * 100;
              const danger = pct > 80;
              const warn = pct > 60 && !danger;
              return (
                <div
                  key={agent.id}
                  className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-4 py-3 hover:bg-muted/10 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground">{agent.name}</div>
                    <div className="text-xs text-muted-foreground">{agent.role}</div>
                  </div>
                  <div className="w-20 text-right">
                    <span
                      className={cn("text-sm font-medium", {
                        "text-red-400": danger,
                        "text-yellow-400": warn,
                        "text-foreground": !danger && !warn,
                      })}
                    >
                      ${agent.monthSpend.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-16 text-right">
                    <span className="text-sm text-muted-foreground">{agent.runs}</span>
                  </div>
                  <div className="w-20 text-right">
                    <span className="text-xs text-muted-foreground">
                      ${agent.avgCostPerRun.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-36 space-y-1">
                    <BudgetBar spend={agent.monthSpend} budget={agent.monthBudget} size="sm" />
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>${agent.monthSpend.toFixed(0)}</span>
                      <span>${agent.monthBudget}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            {/* Totals row */}
            <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-4 py-3 bg-muted/20">
              <div className="text-xs font-semibold text-muted-foreground">TOTAL</div>
              <div className="w-20 text-right text-sm font-semibold text-foreground">
                ${totalSpend.toFixed(2)}
              </div>
              <div className="w-16 text-right text-sm text-muted-foreground">
                {AGENT_COSTS.reduce((a, c) => a + c.runs, 0)}
              </div>
              <div className="w-20 text-right text-xs text-muted-foreground">
                $
                {(
                  totalSpend / AGENT_COSTS.reduce((a, c) => a + c.runs, 0)
                ).toFixed(2)}
              </div>
              <div className="w-36">
                <BudgetBar spend={totalSpend} budget={totalBudget} size="sm" />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
                  <span>${totalSpend.toFixed(0)}</span>
                  <span>${totalBudget}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
