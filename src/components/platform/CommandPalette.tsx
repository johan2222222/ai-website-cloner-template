"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  Inbox,
  CircleDot,
  Repeat2,
  Target,
  Network,
  Boxes,
  DollarSign,
  History,
  Settings,
  Bot,
  CheckSquare,
  ArrowRight,
  Hash,
} from "lucide-react";
import { cn } from "@/lib/utils";

const COMMANDS = [
  { id: "dashboard", label: "Go to Dashboard", icon: LayoutDashboard, href: "/" },
  { id: "inbox", label: "Go to Inbox", icon: Inbox, href: "/inbox" },
  { id: "issues", label: "Go to Issues", icon: CircleDot, href: "/issues" },
  { id: "routines", label: "Go to Routines", icon: Repeat2, href: "/routines" },
  { id: "goals", label: "Go to Goals", icon: Target, href: "/goals" },
  { id: "approvals", label: "Go to Approvals", icon: CheckSquare, href: "/approvals" },
  { id: "agents", label: "Go to Agents", icon: Bot, href: "/agents" },
  { id: "org", label: "Go to Org Chart", icon: Network, href: "/org" },
  { id: "skills", label: "Go to Skills", icon: Boxes, href: "/skills" },
  { id: "costs", label: "Go to Costs", icon: DollarSign, href: "/costs" },
  { id: "activity", label: "Go to Activity", icon: History, href: "/activity" },
  { id: "settings", label: "Go to Settings", icon: Settings, href: "/settings" },
  { id: "new-issue", label: "New Issue", icon: CircleDot, href: "/issues?new=1" },
  { id: "new-agent", label: "New Agent", icon: Bot, href: "/agents?new=1" },
  { id: "new-goal", label: "New Goal", icon: Target, href: "/goals?new=1" },
  { id: "new-routine", label: "New Routine", icon: Repeat2, href: "/routines?new=1" },
  { id: "iss-145", label: "ISS-145 · OAuth2 PKCE flow", icon: Hash, href: "/issues" },
  { id: "iss-144", label: "ISS-144 · Payment service tests", icon: Hash, href: "/issues" },
  { id: "iss-143", label: "ISS-143 · Database query optimization", icon: Hash, href: "/issues" },
  { id: "dev-agent", label: "Dev Agent", icon: Bot, href: "/agents" },
  { id: "qa-agent", label: "QA Agent", icon: Bot, href: "/agents" },
  { id: "pm-agent", label: "PM Agent", icon: Bot, href: "/agents" },
];

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query
    ? COMMANDS.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
    : COMMANDS.slice(0, 10);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const execute = useCallback(
    (cmd: (typeof COMMANDS)[0]) => {
      router.push(cmd.href);
      onClose();
    },
    [router, onClose]
  );

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setSelected((s) => Math.min(s + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)); }
      if (e.key === "Enter" && filtered[selected]) { execute(filtered[selected]); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, filtered, selected, execute, onClose]);

  useEffect(() => { setSelected(0); }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-popover border border-border shadow-2xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, issues, agents..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <kbd className="text-[10px] text-muted-foreground/50 border border-border px-1.5 py-0.5">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-1">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((cmd, i) => (
              <button
                key={cmd.id}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left",
                  i === selected
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground hover:bg-accent/50"
                )}
                onMouseEnter={() => setSelected(i)}
                onClick={() => execute(cmd)}
              >
                <cmd.icon className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="flex-1">{cmd.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
              </button>
            ))
          )}
        </div>

        {/* Footer hints */}
        <div className="flex items-center gap-4 px-4 py-2 border-t border-border text-[10px] text-muted-foreground/50">
          <span><kbd className="border border-border px-1 mr-1">↑↓</kbd>navigate</span>
          <span><kbd className="border border-border px-1 mr-1">↵</kbd>select</span>
          <span><kbd className="border border-border px-1 mr-1">ESC</kbd>close</span>
        </div>
      </div>
    </div>
  );
}
