"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Search, Plus, X, ChevronDown, ChevronUp } from "lucide-react";

type Category = "code" | "test" | "write" | "deploy" | "analyze";

interface Skill {
  id: string;
  name: string;
  category: Category;
  description: string;
  agents: string[];
  instructions: string;
}

const CATEGORY_COLORS: Record<Category, { bg: string; text: string; label: string }> = {
  code:    { bg: "bg-violet-500/15", text: "text-violet-400",  label: "Code"    },
  test:    { bg: "bg-yellow-500/15", text: "text-yellow-400",  label: "Test"    },
  write:   { bg: "bg-blue-500/15",   text: "text-blue-400",    label: "Write"   },
  deploy:  { bg: "bg-orange-500/15", text: "text-orange-400",  label: "Deploy"  },
  analyze: { bg: "bg-emerald-500/15",text: "text-emerald-400", label: "Analyze" },
};

const INITIAL_SKILLS: Skill[] = [
  { id: "s1",  name: "Code Review",        category: "code",    description: "Reviews pull requests for code quality, security issues, and best practices.",              agents: ["Dev Agent", "QA Agent"],              instructions: "Review the provided code changes for: 1) Security vulnerabilities 2) Performance issues 3) Code style consistency 4) Test coverage gaps. Provide actionable feedback with specific line references." },
  { id: "s2",  name: "Write Tests",         category: "test",    description: "Generates comprehensive unit and integration tests for code changes.",                    agents: ["QA Agent"],                           instructions: "Analyze the code and generate tests covering: happy paths, edge cases, error scenarios. Aim for >85% coverage. Use the existing test framework and patterns." },
  { id: "s3",  name: "Generate Docs",       category: "write",   description: "Creates technical documentation from code and API specifications.",                      agents: ["Docs Agent"],                         instructions: "Extract public APIs, create markdown documentation with examples, update the README, and generate OpenAPI spec from route handlers." },
  { id: "s4",  name: "Deploy Service",      category: "deploy",  description: "Handles deployment pipeline execution and rollback procedures.",                         agents: ["Deploy Agent"],                       instructions: "Run deployment checklist, execute CI/CD pipeline, monitor deployment health, roll back automatically if error rate exceeds 1% within 10 minutes." },
  { id: "s5",  name: "Analyze Logs",        category: "analyze", description: "Parses application logs to identify errors, anomalies, and performance bottlenecks.",    agents: ["Dev Agent", "QA Agent"],              instructions: "Query the last 24h of logs, identify ERROR and WARN patterns, correlate with deployment events, generate a summary report with severity rankings." },
  { id: "s6",  name: "Triage Issues",       category: "analyze", description: "Categorizes and prioritizes incoming issues based on severity and business impact.",     agents: ["PM Agent"],                           instructions: "Review new issues, assign priority (P0-P3) based on user impact and business criticality, assign to appropriate agent, add relevant labels." },
  { id: "s7",  name: "Send Report",         category: "write",   description: "Compiles and sends status reports to stakeholders.",                                      agents: ["PM Agent"],                           instructions: "Aggregate metrics from the last period, format as a structured report, highlight wins and blockers, send to configured Slack channel or email." },
  { id: "s8",  name: "Search Web",          category: "analyze", description: "Searches the internet for information relevant to current tasks.",                       agents: ["Dev Agent", "PM Agent", "Docs Agent"], instructions: "Use search tools to find relevant documentation, Stack Overflow answers, GitHub issues, or news. Summarize findings and cite sources." },
  { id: "s9",  name: "Run SQL Query",       category: "code",    description: "Executes read-only database queries to gather data insights.",                           agents: ["Dev Agent", "PM Agent"],              instructions: "Construct and execute SELECT queries against the production read replica. Never run INSERT/UPDATE/DELETE. Return results in a formatted table." },
  { id: "s10", name: "Write PR Description",category: "write",   description: "Generates clear, informative pull request descriptions from diffs.",                    agents: ["Dev Agent"],                          instructions: "Analyze the git diff, write a concise PR title, summary of changes, testing notes, and screenshots section. Use the team's PR template." },
  { id: "s11", name: "Monitor Metrics",     category: "analyze", description: "Watches key application metrics and alerts on anomalies.",                               agents: ["Deploy Agent", "QA Agent"],           instructions: "Poll Grafana/Datadog every 5 minutes. Alert if: error rate >0.5%, p95 latency >500ms, CPU >80%, memory >85%. Include trend data in alerts." },
  { id: "s12", name: "Parse JSON Schema",   category: "code",    description: "Validates and transforms JSON data against schemas.",                                    agents: ["Dev Agent"],                          instructions: "Parse the provided JSON, validate against the schema, report validation errors with path references, suggest schema fixes for invalid data." },
];

const AGENT_COLORS: Record<string, string> = {
  "Dev Agent":    "bg-violet-500/15 text-violet-400",
  "QA Agent":     "bg-yellow-500/15 text-yellow-400",
  "PM Agent":     "bg-emerald-500/15 text-emerald-400",
  "Docs Agent":   "bg-pink-500/15 text-pink-400",
  "Deploy Agent": "bg-orange-500/15 text-orange-400",
};

function CategoryBadge({ category }: { category: Category }) {
  const { bg, text, label } = CATEGORY_COLORS[category];
  return (
    <span className={cn("px-1.5 py-0.5 text-[10px] font-medium", bg, text)}>
      {label}
    </span>
  );
}

function AgentPill({ name }: { name: string }) {
  const cls = AGENT_COLORS[name] ?? "bg-muted text-muted-foreground";
  return (
    <span className={cn("px-1.5 py-0.5 text-[10px] font-medium", cls)}>
      {name}
    </span>
  );
}

function SkillCard({
  skill,
  expanded,
  onToggle,
}: {
  skill: Skill;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={cn(
        "bg-card border border-border p-4 cursor-pointer transition-colors hover:border-foreground/20",
        expanded && "border-foreground/30"
      )}
      onClick={onToggle}
    >
      {/* Top row */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-sm font-medium text-foreground truncate">
          {skill.name}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          <CategoryBadge category={skill.category} />
          {expanded ? (
            <ChevronUp className="w-3 h-3 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
        {skill.description}
      </p>

      {/* Bottom row */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] text-muted-foreground mr-0.5">
          Used by {skill.agents.length} {skill.agents.length === 1 ? "agent" : "agents"}:
        </span>
        {skill.agents.map((agent) => (
          <AgentPill key={agent} name={agent} />
        ))}
      </div>

      {/* Expanded instructions */}
      {expanded && (
        <div
          className="mt-3 pt-3 border-t border-border"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Instructions
          </p>
          <textarea
            readOnly
            value={skill.instructions}
            rows={4}
            className="w-full resize-none bg-background border border-border px-3 py-2 text-xs text-foreground/80 focus:outline-none font-mono leading-relaxed"
          />
        </div>
      )}
    </div>
  );
}

interface NewSkillForm {
  name: string;
  description: string;
  category: Category;
  instructions: string;
}

const EMPTY_FORM: NewSkillForm = {
  name: "",
  description: "",
  category: "code",
  instructions: "",
};

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>(INITIAL_SKILLS);
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<NewSkillForm>(EMPTY_FORM);

  const filtered = skills.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.description.toLowerCase().includes(query.toLowerCase())
  );

  function handleToggle(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  function handleCreate() {
    if (!form.name.trim()) return;
    const newSkill: Skill = {
      id: `s${Date.now()}`,
      name: form.name.trim(),
      description: form.description.trim() || "No description.",
      category: form.category,
      agents: [],
      instructions: form.instructions.trim(),
    };
    setSkills((prev) => [newSkill, ...prev]);
    setForm(EMPTY_FORM);
    setShowModal(false);
  }

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Page header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <h1 className="text-base font-semibold text-foreground">Skills</h1>
          <span className="flex items-center justify-center h-4 min-w-5 px-1 text-[10px] font-medium bg-muted text-muted-foreground">
            {skills.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search skills..."
              className="pl-7 pr-3 py-1.5 text-xs bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 transition-colors w-48"
            />
          </div>
          {/* New Skill button */}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 text-white text-xs font-medium hover:bg-violet-500 transition-colors"
          >
            <Plus className="w-3 h-3" />
            New Skill
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
            No skills found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
            {filtered.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                expanded={expandedId === skill.id}
                onToggle={() => handleToggle(skill.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* New Skill Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div className="bg-card border border-border w-full max-w-md mx-4 flex flex-col">
            {/* Modal header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">New Skill</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-4 py-4 flex flex-col gap-3">
              {/* Name */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Summarize Ticket"
                  className="bg-background border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 transition-colors"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Brief description of what this skill does..."
                  rows={2}
                  className="resize-none bg-background border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 transition-colors"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value as Category }))
                  }
                  className="bg-background border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-foreground/30 transition-colors"
                >
                  {(Object.keys(CATEGORY_COLORS) as Category[]).map((cat) => (
                    <option key={cat} value={cat}>
                      {CATEGORY_COLORS[cat].label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Instructions */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  Instructions
                </label>
                <textarea
                  value={form.instructions}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, instructions: e.target.value }))
                  }
                  placeholder="Describe step-by-step what the agent should do when using this skill..."
                  rows={6}
                  className="resize-none bg-background border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 transition-colors font-mono"
                />
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!form.name.trim()}
                className="px-4 py-1.5 bg-violet-600 text-white text-xs font-medium hover:bg-violet-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Create Skill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
