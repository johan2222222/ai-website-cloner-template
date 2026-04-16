"use client";

import { useState, useEffect, useRef } from "react";
import {
  Settings,
  Bot,
  DollarSign,
  Bell,
  Palette,
  Cpu,
  Link2,
  AlertTriangle,
  Sparkles,
  Brain,
  Zap,
  Wind,
  Layers,
  Network,
  Plus,
  Check,
  X,
  Key,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n, LANGUAGES, type LangCode } from "@/context/i18n";

// ─── Types ────────────────────────────────────────────────────────────────────

type Section =
  | "General"
  | "Agents"
  | "Budget"
  | "Notifications"
  | "Appearance"
  | "API & Models"
  | "Integrations"
  | "Danger Zone";

interface NavItem {
  label: Section;
  icon: React.ReactNode;
  danger?: boolean;
}

interface ApiKey {
  id: string;
  name: string;
  provider: string;
  endpoint: string;
  status: "active" | "inactive";
}

interface ProviderCard {
  name: string;
  icon: "brain" | "zap" | "wind" | "cpu" | "layers" | "network";
  models: string;
  tier: string;
  connected: boolean;
  color: string;
}

// ─── Nav config ───────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { label: "General",       icon: <Settings   className="h-4 w-4" /> },
  { label: "Agents",        icon: <Bot        className="h-4 w-4" /> },
  { label: "Budget",        icon: <DollarSign className="h-4 w-4" /> },
  { label: "Notifications", icon: <Bell       className="h-4 w-4" /> },
  { label: "Appearance",    icon: <Palette    className="h-4 w-4" /> },
  { label: "API & Models",  icon: <Cpu        className="h-4 w-4" /> },
  { label: "Integrations",  icon: <Link2      className="h-4 w-4" /> },
  { label: "Danger Zone",   icon: <AlertTriangle className="h-4 w-4" />, danger: true },
];

// ─── Shared primitives ────────────────────────────────────────────────────────

function useSave() {
  const [saved, setSaved] = useState(false);
  const save = () => setSaved(true);
  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 2000);
    return () => clearTimeout(t);
  }, [saved]);
  return { saved, save };
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-6 text-lg font-semibold tracking-tight text-foreground">
      {children}
    </h2>
  );
}

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/60 bg-card p-5 transition-all duration-200",
        className
      )}
    >
      {children}
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-border/60 bg-muted/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground backdrop-blur-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sidebar-primary/40 focus:border-sidebar-primary/50";

const selectCls =
  "w-full rounded-xl border border-border/60 bg-muted/40 px-3 py-2 text-sm text-foreground backdrop-blur-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sidebar-primary/40 focus:border-sidebar-primary/50 cursor-pointer";

function SaveBtn({
  onClick,
  saved,
}: {
  onClick: () => void;
  saved: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200",
        saved
          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
          : "bg-sidebar-primary/15 text-sidebar-primary border border-sidebar-primary/30 hover:bg-sidebar-primary/25"
      )}
    >
      {saved ? (
        <>
          <Check className="h-3.5 w-3.5" />
          Saved
        </>
      ) : (
        "Save"
      )}
    </button>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {description && (
          <span className="text-xs text-muted-foreground">{description}</span>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-all duration-200 focus:outline-none",
          checked ? "bg-sidebar-primary" : "bg-muted"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}

// ─── GENERAL ──────────────────────────────────────────────────────────────────

function GeneralSection() {
  const { saved, save } = useSave();
  const { lang, setLang } = useI18n();
  const [company, setCompany] = useState("MyaiCompany");
  const [timezone, setTimezone] = useState("UTC");

  return (
    <div className="flex flex-col gap-5 max-w-xl">
      <SectionHeading>General</SectionHeading>

      <Card>
        <div className="flex flex-col gap-5">
          <Field label="Company Name" hint="Displayed across your workspace.">
            <input
              className={inputCls}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="MyaiCompany"
            />
          </Field>

          <Field label="Timezone">
            <select
              className={selectCls}
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            >
              {[
                "UTC",
                "UTC+1",
                "UTC+2",
                "UTC+3",
                "UTC+4",
                "UTC+5",
                "UTC+6",
                "UTC+7",
                "UTC+8",
                "EST",
                "CST",
                "PST",
                "JST",
                "IST",
                "AEST",
              ].map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Language" hint="Changes the interface language for all users.">
            <select
              className={selectCls}
              value={lang}
              onChange={(e) => setLang(e.target.value as LangCode)}
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name} — {l.nativeName}
                </option>
              ))}
            </select>
          </Field>

          <div className="pt-1">
            <SaveBtn onClick={save} saved={saved} />
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── AGENTS ───────────────────────────────────────────────────────────────────

function AgentsSection() {
  const { saved, save } = useSave();
  const [adapter, setAdapter] = useState("claude-code");
  const [maxRuns, setMaxRuns] = useState(3);
  const [heartbeat, setHeartbeat] = useState("1m");
  const [autoPause, setAutoPause] = useState(false);

  return (
    <div className="flex flex-col gap-5 max-w-xl">
      <SectionHeading>Agents</SectionHeading>

      <Card>
        <div className="flex flex-col gap-5">
          <Field label="Default Adapter" hint="The adapter used when creating new agents.">
            <select
              className={selectCls}
              value={adapter}
              onChange={(e) => setAdapter(e.target.value)}
            >
              {["claude-code", "claude-api", "bash", "cursor"].map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Max Concurrent Runs" hint="How many agents can run in parallel (1–10).">
            <input
              type="number"
              min={1}
              max={10}
              className={inputCls}
              value={maxRuns}
              onChange={(e) => setMaxRuns(Number(e.target.value))}
            />
          </Field>

          <Field label="Heartbeat Interval" hint="How often agents report their status.">
            <select
              className={selectCls}
              value={heartbeat}
              onChange={(e) => setHeartbeat(e.target.value)}
            >
              {["30s", "1m", "5m", "10m", "30m"].map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </Field>

          <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
            <Toggle
              checked={autoPause}
              onChange={setAutoPause}
              label="Auto-pause on error"
              description="Automatically pause an agent when it encounters an unhandled error."
            />
          </div>

          <div className="pt-1">
            <SaveBtn onClick={save} saved={saved} />
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── BUDGET ───────────────────────────────────────────────────────────────────

function BudgetSection() {
  const { saved, save } = useSave();
  const [globalLimit, setGlobalLimit] = useState("500");
  const [perAgent, setPerAgent] = useState("100");
  const [threshold, setThreshold] = useState("80");
  const [carryOver, setCarryOver] = useState(false);

  return (
    <div className="flex flex-col gap-5 max-w-xl">
      <SectionHeading>Budget</SectionHeading>

      <Card>
        <div className="flex flex-col gap-5">
          <Field label="Global Monthly Limit ($)" hint="Hard cap across all agents and runs.">
            <input
              type="number"
              className={inputCls}
              value={globalLimit}
              onChange={(e) => setGlobalLimit(e.target.value)}
              placeholder="500"
            />
          </Field>

          <Field label="Per-agent Default ($)" hint="Default budget assigned to each new agent.">
            <input
              type="number"
              className={inputCls}
              value={perAgent}
              onChange={(e) => setPerAgent(e.target.value)}
              placeholder="100"
            />
          </Field>

          <Field label="Alert Threshold (%)" hint="Send a notification when this % of the budget is consumed.">
            <input
              type="number"
              className={inputCls}
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              placeholder="80"
            />
          </Field>

          <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
            <Toggle
              checked={carryOver}
              onChange={setCarryOver}
              label="Carry over unused budget"
              description="Roll remaining budget into the next month instead of resetting."
            />
          </div>

          <div className="pt-1">
            <SaveBtn onClick={save} saved={saved} />
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────

function NotificationsSection() {
  const { saved, save } = useSave();
  const [toggles, setToggles] = useState<{
    errorEmail: boolean;
    approvalEmail: boolean;
    budgetEmail: boolean;
    goalEmail: boolean;
  }>({
    errorEmail: true,
    approvalEmail: true,
    budgetEmail: false,
    goalEmail: false,
  });
  const [slackUrl, setSlackUrl] = useState("");

  const setToggle =
    (key: keyof typeof toggles) => (v: boolean) =>
      setToggles((prev) => ({ ...prev, [key]: v }));

  return (
    <div className="flex flex-col gap-5 max-w-xl">
      <SectionHeading>Notifications</SectionHeading>

      <Card>
        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Email Alerts
          </p>
          <Toggle
            checked={toggles.errorEmail}
            onChange={setToggle("errorEmail")}
            label="Agent error"
            description="Notify when an agent fails or throws an error."
          />
          <div className="h-px bg-border/60" />
          <Toggle
            checked={toggles.approvalEmail}
            onChange={setToggle("approvalEmail")}
            label="Approval request"
            description="Notify when an agent is waiting for human approval."
          />
          <div className="h-px bg-border/60" />
          <Toggle
            checked={toggles.budgetEmail}
            onChange={setToggle("budgetEmail")}
            label="Budget alert"
            description="Notify when budget threshold is reached."
          />
          <div className="h-px bg-border/60" />
          <Toggle
            checked={toggles.goalEmail}
            onChange={setToggle("goalEmail")}
            label="Goal completion"
            description="Notify when an agent goal is marked as completed."
          />
        </div>
      </Card>

      <Card>
        <Field
          label="Slack Webhook URL"
          hint="Receive real-time alerts directly in your Slack workspace."
        >
          <div className="flex gap-2">
            <input
              className={cn(inputCls, "flex-1")}
              placeholder="https://hooks.slack.com/services/..."
              value={slackUrl}
              onChange={(e) => setSlackUrl(e.target.value)}
            />
            <button
              onClick={() => window.alert("Test Slack message sent!")}
              className="shrink-0 rounded-xl border border-border/60 bg-muted/40 px-3 py-2 text-sm text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground whitespace-nowrap"
            >
              Test Slack
            </button>
          </div>
        </Field>
      </Card>

      <SaveBtn onClick={save} saved={saved} />
    </div>
  );
}

// ─── APPEARANCE ───────────────────────────────────────────────────────────────

function AppearanceSection() {
  const { saved, save } = useSave();
  const [theme, setTheme] = useState<"Dark" | "Light" | "System">("Dark");
  const [density, setDensity] = useState<"Compact" | "Default" | "Comfortable">("Default");
  const [accentColor, setAccentColor] = useState("#6366f1");

  const ACCENT_COLORS: { hex: string; label: string }[] = [
    { hex: "#6366f1", label: "Purple" },
    { hex: "#3b82f6", label: "Blue" },
    { hex: "#10b981", label: "Emerald" },
    { hex: "#f97316", label: "Orange" },
    { hex: "#ec4899", label: "Pink" },
  ];

  const THEMES = ["Dark", "Light", "System"] as const;
  const DENSITIES = ["Compact", "Default", "Comfortable"] as const;

  return (
    <div className="flex flex-col gap-5 max-w-xl">
      <SectionHeading>Appearance</SectionHeading>

      <Card>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-foreground">Theme</p>
            <div className="grid grid-cols-3 gap-2">
              {THEMES.map((t) => {
                const active = theme === t;
                return (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border p-3 text-sm transition-all duration-200",
                      active
                        ? "border-sidebar-primary/50 bg-sidebar-primary/10 text-sidebar-primary"
                        : "border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                    )}
                  >
                    <div
                      className={cn(
                        "h-8 w-full rounded-lg border",
                        t === "Dark"
                          ? "bg-zinc-900 border-zinc-700"
                          : t === "Light"
                          ? "bg-zinc-100 border-zinc-200"
                          : "bg-gradient-to-r from-zinc-900 to-zinc-100 border-zinc-500"
                      )}
                    />
                    {t}
                    {active && <Check className="h-3 w-3" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-border/60" />

          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-foreground">Density</p>
            <div className="flex gap-2">
              {DENSITIES.map((d) => {
                const active = density === d;
                return (
                  <button
                    key={d}
                    onClick={() => setDensity(d)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200",
                      active
                        ? "border-sidebar-primary/50 bg-sidebar-primary/15 text-sidebar-primary"
                        : "border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                    )}
                  >
                    {active && <Check className="h-3 w-3" />}
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-border/60" />

          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-foreground">Accent Color</p>
            <div className="flex gap-3">
              {ACCENT_COLORS.map((c) => (
                <button
                  key={c.hex}
                  title={c.label}
                  onClick={() => setAccentColor(c.hex)}
                  className={cn(
                    "h-8 w-8 rounded-full border-2 transition-all duration-200 hover:scale-110",
                    accentColor === c.hex
                      ? "border-white/80 scale-110"
                      : "border-transparent"
                  )}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          <div className="pt-1">
            <SaveBtn onClick={save} saved={saved} />
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── API & MODELS ─────────────────────────────────────────────────────────────

const PROVIDERS: ProviderCard[] = [
  { name: "OpenAI",      icon: "brain",   models: "GPT-4o, o1, o3",           tier: "Pay per use",  connected: false, color: "#10a37f" },
  { name: "Anthropic",   icon: "zap",     models: "Claude 4, Sonnet, Haiku",   tier: "Pay per use",  connected: true,  color: "#e07050" },
  { name: "Mistral",     icon: "wind",    models: "Mistral Large, Nemo",       tier: "Pay per use",  connected: false, color: "#ff7000" },
  { name: "Groq",        icon: "cpu",     models: "Llama 3.3, Mixtral",        tier: "Ultra-fast",   connected: false, color: "#f55036" },
  { name: "Cohere",      icon: "layers",  models: "Command R+",                tier: "Pay per use",  connected: false, color: "#3b82f6" },
  { name: "Together AI", icon: "network", models: "100+ open models",          tier: "Pay per use",  connected: false, color: "#8b5cf6" },
];

function ProviderIcon({ icon, color }: { icon: ProviderCard["icon"]; color: string }) {
  const cls = "h-5 w-5";
  const map: Record<ProviderCard["icon"], React.ReactNode> = {
    brain:   <Brain   className={cls} />,
    zap:     <Zap     className={cls} />,
    wind:    <Wind    className={cls} />,
    cpu:     <Cpu     className={cls} />,
    layers:  <Layers  className={cls} />,
    network: <Network className={cls} />,
  };
  return (
    <div
      className="flex h-9 w-9 items-center justify-center rounded-xl"
      style={{ backgroundColor: color + "22", color }}
    >
      {map[icon]}
    </div>
  );
}

const INITIAL_KEYS: ApiKey[] = [
  { id: "k1", name: "Production Key", provider: "OpenAI",    endpoint: "api.openai.com",    status: "active" },
  { id: "k2", name: "Dev Claude Key", provider: "Anthropic", endpoint: "api.anthropic.com", status: "active" },
];

function ApiModelsSection() {
  const [providers, setProviders] = useState<ProviderCard[]>(PROVIDERS);
  const [keys, setKeys] = useState<ApiKey[]>(INITIAL_KEYS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const [newKey, setNewKey] = useState<{
    name: string;
    provider: string;
    apiKey: string;
    endpoint: string;
  }>({ name: "", provider: "OpenAI", apiKey: "", endpoint: "" });

  const toggleProvider = (name: string) => {
    setProviders((prev) =>
      prev.map((p) => (p.name === name ? { ...p, connected: !p.connected } : p))
    );
  };

  const addKey = () => {
    if (!newKey.name || !newKey.apiKey) return;
    setKeys((prev) => [
      ...prev,
      {
        id: `k${Date.now()}`,
        name: newKey.name,
        provider: newKey.provider,
        endpoint: newKey.endpoint || `api.${newKey.provider.toLowerCase()}.com`,
        status: "active",
      },
    ]);
    setNewKey({ name: "", provider: "OpenAI", apiKey: "", endpoint: "" });
    setShowAddForm(false);
  };

  const removeKey = (id: string) =>
    setKeys((prev) => prev.filter((k) => k.id !== id));

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <SectionHeading>API & Models</SectionHeading>

      {/* ── Gemma 4 card ─────────────────────────────────── */}
      <div className="overflow-hidden rounded-xl border border-purple-500/30 bg-card">
        <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/40 px-5 py-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 border border-purple-500/30">
              <Sparkles className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Gemma 4</p>
              <p className="text-xs text-purple-300/80">by Google DeepMind</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Active
              </span>
              <span className="rounded-full bg-purple-500/15 border border-purple-500/30 px-2.5 py-0.5 text-xs text-purple-300">
                Default Model
              </span>
            </div>
          </div>
        </div>

        <div className="px-5 py-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Our default model. State-of-the-art performance with multimodal capabilities. Optimized for agent workflows.
          </p>

          <div className="mt-4 flex gap-4">
            {[
              { label: "Context", value: "1M tokens" },
              { label: "Speed",   value: "Fast" },
              { label: "Cost",    value: "Included" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col gap-0.5 rounded-xl border border-border/60 bg-muted/30 px-3 py-2"
              >
                <span className="text-xs text-muted-foreground">{stat.label}</span>
                <span className="text-sm font-medium text-foreground">{stat.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 relative inline-block">
            <button
              disabled
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="rounded-xl border border-border/40 bg-muted/30 px-4 py-2 text-sm text-muted-foreground cursor-not-allowed"
            >
              Configure
            </button>
            {showTooltip && (
              <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-lg bg-popover border border-border/60 px-3 py-1.5 text-xs text-muted-foreground whitespace-nowrap shadow-lg backdrop-blur-md">
                Coming soon
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-border/60" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Marketplace ──────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">Marketplace</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            One API key, access to all providers
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {providers.map((provider) => (
            <div
              key={provider.name}
              className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-4 transition-all duration-200 hover:border-border"
            >
              <div className="flex items-center gap-2.5">
                <ProviderIcon icon={provider.icon} color={provider.color} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{provider.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{provider.models}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="rounded-full bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground">
                  {provider.tier}
                </span>
                {provider.connected && (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-xs text-emerald-400">
                    <Check className="h-3 w-3" />
                    Connected
                  </span>
                )}
              </div>

              <button
                onClick={() => toggleProvider(provider.name)}
                className={cn(
                  "w-full rounded-xl border px-3 py-1.5 text-xs font-medium transition-all duration-200",
                  provider.connected
                    ? "border-border/60 bg-muted/20 text-muted-foreground hover:border-red-500/40 hover:text-red-400"
                    : "border-sidebar-primary/30 bg-sidebar-primary/10 text-sidebar-primary hover:bg-sidebar-primary/20"
                )}
              >
                {provider.connected ? "Manage" : "Connect"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Custom API Keys ───────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-foreground">Your API Keys</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Manage custom keys for direct provider access
            </p>
          </div>
          <button
            onClick={() => setShowAddForm((v) => !v)}
            className="flex items-center gap-1.5 rounded-xl border border-sidebar-primary/30 bg-sidebar-primary/10 px-3 py-2 text-sm font-medium text-sidebar-primary transition-all duration-200 hover:bg-sidebar-primary/20"
          >
            <Plus className="h-4 w-4" />
            Add Key
          </button>
        </div>

        {/* Add form */}
        {showAddForm && (
          <Card className="border-sidebar-primary/20 bg-sidebar-primary/5">
            <div className="flex flex-col gap-4">
              <p className="text-sm font-medium text-foreground">New API Key</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Name">
                  <input
                    className={inputCls}
                    placeholder="e.g. Production Key"
                    value={newKey.name}
                    onChange={(e) => setNewKey((p) => ({ ...p, name: e.target.value }))}
                  />
                </Field>
                <Field label="Provider">
                  <select
                    className={selectCls}
                    value={newKey.provider}
                    onChange={(e) => setNewKey((p) => ({ ...p, provider: e.target.value }))}
                  >
                    {providers.map((p) => (
                      <option key={p.name} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="API Key">
                  <input
                    type="password"
                    className={inputCls}
                    placeholder="sk-..."
                    value={newKey.apiKey}
                    onChange={(e) => setNewKey((p) => ({ ...p, apiKey: e.target.value }))}
                  />
                </Field>
                <Field label="Endpoint (optional)">
                  <input
                    className={inputCls}
                    placeholder="api.openai.com"
                    value={newKey.endpoint}
                    onChange={(e) => setNewKey((p) => ({ ...p, endpoint: e.target.value }))}
                  />
                </Field>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={addKey}
                  className="flex items-center gap-1.5 rounded-xl border border-sidebar-primary/30 bg-sidebar-primary/15 px-4 py-2 text-sm font-medium text-sidebar-primary transition-all duration-200 hover:bg-sidebar-primary/25"
                >
                  <Key className="h-3.5 w-3.5" />
                  Save Key
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="rounded-xl border border-border/60 bg-muted/20 px-4 py-2 text-sm text-muted-foreground transition-all duration-200 hover:bg-muted/40 hover:text-foreground"
                >
                  Cancel
                </button>
              </div>
            </div>
          </Card>
        )}

        {/* Keys table */}
        <div className="overflow-hidden rounded-xl border border-border/60">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Endpoint
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {keys.map((k, i) => (
                <tr
                  key={k.id}
                  className={cn(
                    "border-b border-border/40 transition-colors hover:bg-muted/20",
                    i === keys.length - 1 && "border-b-0"
                  )}
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      <Key className="h-3.5 w-3.5 text-muted-foreground" />
                      {k.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{k.provider}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <span>{k.endpoint}</span>
                      <ExternalLink className="h-3 w-3 opacity-50" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex w-fit items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      {k.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => removeKey(k.id)}
                      className="rounded-lg border border-transparent p-1 text-muted-foreground transition-all duration-200 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {keys.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No API keys yet. Click "+ Add Key" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── INTEGRATIONS ─────────────────────────────────────────────────────────────

const INTEGRATIONS_DATA = [
  {
    key: "github",
    name: "GitHub",
    description: "Sync issues and pull requests with your agents",
    connected: true,
    iconColor: "#f0f6ff",
    bgColor: "#24292e",
  },
  {
    key: "slack",
    name: "Slack",
    description: "Receive notifications and approvals in Slack",
    connected: false,
    iconColor: "#4a154b",
    bgColor: "#ecb22e",
  },
  {
    key: "linear",
    name: "Linear",
    description: "Sync Linear issues and track progress",
    connected: false,
    iconColor: "#f0f0ff",
    bgColor: "#5e6ad2",
  },
  {
    key: "jira",
    name: "Jira",
    description: "Sync Jira tickets with agent runs",
    connected: false,
    iconColor: "#f0f4ff",
    bgColor: "#0052cc",
  },
];

function IntegrationsSection() {
  const [connected, setConnected] = useState<Record<string, boolean>>(
    Object.fromEntries(INTEGRATIONS_DATA.map((i) => [i.key, i.connected]))
  );

  const toggle = (key: string) =>
    setConnected((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <SectionHeading>Integrations</SectionHeading>

      <div className="grid grid-cols-2 gap-4">
        {INTEGRATIONS_DATA.map((integration) => {
          const isConnected = connected[integration.key];
          return (
            <Card key={integration.key} className={cn(isConnected && "border-emerald-500/20")}>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold"
                    style={{
                      backgroundColor: integration.bgColor + "22",
                      color: integration.bgColor,
                      border: `1px solid ${integration.bgColor}33`,
                    }}
                  >
                    {integration.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">
                        {integration.name}
                      </p>
                      {isConnected && (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-xs text-emerald-400">
                          <Check className="h-3 w-3" />
                          Connected
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                      {integration.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggle(integration.key)}
                  className={cn(
                    "w-full rounded-xl border px-3 py-2 text-xs font-medium transition-all duration-200",
                    isConnected
                      ? "border-border/60 bg-muted/20 text-muted-foreground hover:border-red-500/40 hover:text-red-400"
                      : "border-sidebar-primary/30 bg-sidebar-primary/10 text-sidebar-primary hover:bg-sidebar-primary/20"
                  )}
                >
                  {isConnected ? "Disconnect" : "Connect"}
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── DANGER ZONE ──────────────────────────────────────────────────────────────

function DangerZoneSection() {
  const [confirming, setConfirming] = useState<string | null>(null);

  const actions: {
    id: string;
    title: string;
    description: string;
    buttonLabel: string;
    confirmMessage: string;
    destructive?: boolean;
  }[] = [
    {
      id: "reset-agents",
      title: "Reset all agents",
      description: "Remove all agent configurations and run history. This cannot be undone.",
      buttonLabel: "Reset all agents",
      confirmMessage: "Are you sure you want to reset all agents? This cannot be undone.",
    },
    {
      id: "export-data",
      title: "Export all data",
      description: "Download a full JSON archive of your workspace data.",
      buttonLabel: "Export all data",
      confirmMessage: "Download all workspace data as a JSON archive?",
    },
    {
      id: "delete-company",
      title: "Delete company",
      description: "Permanently delete your company and all associated data. Irreversible.",
      buttonLabel: "Delete company",
      confirmMessage:
        "This will permanently delete your company and all associated data. This action cannot be undone. Continue?",
      destructive: true,
    },
  ];

  const handleClick = (action: (typeof actions)[number]) => {
    if (confirming === action.id) {
      window.alert(
        action.id === "export-data" ? "Download started." : `${action.title} initiated.`
      );
      setConfirming(null);
    } else {
      setConfirming(action.id);
    }
  };

  return (
    <div className="flex flex-col gap-5 max-w-xl">
      <SectionHeading>Danger Zone</SectionHeading>

      <div className="overflow-hidden rounded-xl border border-red-500/30">
        {actions.map((action, idx) => (
          <div
            key={action.id}
            className={cn(
              "flex items-center justify-between gap-4 p-5 transition-colors hover:bg-red-500/5",
              idx !== actions.length - 1 && "border-b border-red-500/20"
            )}
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{action.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                {action.description}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {confirming === action.id && (
                <button
                  onClick={() => setConfirming(null)}
                  className="rounded-xl border border-border/60 px-3 py-1.5 text-xs text-muted-foreground transition-all duration-200 hover:bg-muted/40"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={() => handleClick(action)}
                className={cn(
                  "rounded-xl border px-3 py-1.5 text-xs font-medium transition-all duration-200 whitespace-nowrap",
                  confirming === action.id
                    ? "border-red-500/50 bg-red-500/20 text-red-300 hover:bg-red-500/30"
                    : action.destructive
                    ? "border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    : "border-red-500/30 bg-transparent text-red-400/80 hover:bg-red-500/10 hover:text-red-400"
                )}
              >
                {confirming === action.id ? "Confirm" : action.buttonLabel}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>("General");

  function renderContent() {
    switch (activeSection) {
      case "General":       return <GeneralSection />;
      case "Agents":        return <AgentsSection />;
      case "Budget":        return <BudgetSection />;
      case "Notifications": return <NotificationsSection />;
      case "Appearance":    return <AppearanceSection />;
      case "API & Models":  return <ApiModelsSection />;
      case "Integrations":  return <IntegrationsSection />;
      case "Danger Zone":   return <DangerZoneSection />;
    }
  }

  return (
    <div className="flex h-full bg-background">
      {/* ── Left nav ─────────────────────────────────────── */}
      <nav className="w-52 shrink-0 border-r border-border/60 py-4 px-2">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
          Settings
        </p>
        <div className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const active = item.label === activeSection;
            return (
              <button
                key={item.label}
                onClick={() => setActiveSection(item.label)}
                className={cn(
                  "group relative flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-all duration-200",
                  active
                    ? "bg-sidebar-primary/15 text-sidebar-primary font-medium"
                    : item.danger
                    ? "text-red-400/70 hover:bg-red-500/10 hover:text-red-400"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-sidebar-primary rounded-full" />
                )}
                <span
                  className={cn(
                    "shrink-0 transition-colors duration-200",
                    active
                      ? "text-sidebar-primary"
                      : item.danger
                      ? "text-red-400/70"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                >
                  {item.icon}
                </span>
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── Right content ────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto p-8">{renderContent()}</main>
    </div>
  );
}
