"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Bot,
  DollarSign,
  Clock,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  X,
  ChevronRight,
  Network,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Data ────────────────────────────────────────────────────────────────────

type AgentStatus = "active" | "paused" | "error";

interface Agent {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  adapter: string;
  monthlyCost: number;
  budget: number;
  lastHeartbeat: string;
  currentTask: string;
  supervisorId?: string;
}

const AGENTS: Agent[] = [
  {
    id: "agt-1",
    name: "Dev Agent",
    role: "Senior Software Engineer",
    status: "active",
    adapter: "GPT-4o",
    monthlyCost: 84.5,
    budget: 120,
    lastHeartbeat: "2s ago",
    currentTask: "Refactoring auth module",
    supervisorId: undefined,
  },
  {
    id: "agt-3",
    name: "PM Agent",
    role: "Product Manager",
    status: "paused",
    adapter: "Claude 3",
    monthlyCost: 18.0,
    budget: 60,
    lastHeartbeat: "12m ago",
    currentTask: "Idle",
    supervisorId: undefined,
  },
  {
    id: "agt-5",
    name: "Deploy Agent",
    role: "DevOps Engineer",
    status: "paused",
    adapter: "GPT-4o",
    monthlyCost: 31.1,
    budget: 80,
    lastHeartbeat: "5m ago",
    currentTask: "Idle",
    supervisorId: undefined,
  },
  {
    id: "agt-2",
    name: "QA Agent",
    role: "QA Engineer",
    status: "active",
    adapter: "Gemini",
    monthlyCost: 42.2,
    budget: 70,
    lastHeartbeat: "8s ago",
    currentTask: "Running test suite",
    supervisorId: "agt-1",
  },
  {
    id: "agt-4",
    name: "Docs Agent",
    role: "Technical Writer",
    status: "error",
    adapter: "Claude 3",
    monthlyCost: 6.8,
    budget: 30,
    lastHeartbeat: "1h ago",
    currentTask: "Stalled – token limit",
    supervisorId: "agt-1",
  },
];

// Supervisor → subordinate edges (agt-2 and agt-4 report to agt-1)
const EDGES: { from: string; to: string }[] = [
  { from: "agt-1", to: "agt-2" },
  { from: "agt-1", to: "agt-4" },
];

// Initial canvas positions
const INITIAL_POSITIONS: Record<string, { x: number; y: number }> = {
  "agt-1": { x: 350, y: 80 },
  "agt-3": { x: 80, y: 240 },
  "agt-5": { x: 620, y: 240 },
  "agt-2": { x: 200, y: 420 },
  "agt-4": { x: 500, y: 420 },
};

const NODE_W = 180;
const NODE_H = 80;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_DOT: Record<AgentStatus, string> = {
  active: "bg-emerald-400",
  paused: "bg-yellow-400",
  error: "bg-red-400",
};

const STATUS_LABEL: Record<AgentStatus, string> = {
  active: "Active",
  paused: "Paused",
  error: "Error",
};

const ADAPTER_PILL: Record<string, string> = {
  "GPT-4o": "bg-green-500/15 text-green-400 border border-green-500/25",
  "Claude 3": "bg-violet-500/15 text-violet-400 border border-violet-500/25",
  Gemini: "bg-blue-500/15 text-blue-400 border border-blue-500/25",
};

function adapterClass(adapter: string) {
  return ADAPTER_PILL[adapter] ?? "bg-muted/40 text-muted-foreground border border-border";
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function DetailPanel({ agent, onClose }: { agent: Agent; onClose: () => void }) {
  const pct = Math.min(100, (agent.monthlyCost / agent.budget) * 100);
  const barColor =
    pct > 85 ? "bg-red-400" : pct > 60 ? "bg-yellow-400" : "bg-emerald-400";

  return (
    <div className="w-72 shrink-0 h-full flex flex-col bg-card/90 backdrop-blur-xl border-l border-border animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate">{agent.name}</div>
          <div className="text-xs text-muted-foreground truncate">{agent.role}</div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {/* Status + adapter */}
        <div className="flex items-center gap-2">
          <span className={cn("w-2 h-2 rounded-full shrink-0", STATUS_DOT[agent.status])} />
          <span className="text-sm text-foreground">{STATUS_LABEL[agent.status]}</span>
          <span
            className={cn(
              "ml-auto rounded-full text-[10px] px-2 py-0.5 font-medium",
              adapterClass(agent.adapter)
            )}
          >
            {agent.adapter}
          </span>
        </div>

        {/* Budget bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Monthly budget</span>
            <span className="tabular-nums">
              ${agent.monthlyCost.toFixed(2)} / ${agent.budget}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-muted/40">
            <div
              className={cn("h-full rounded-full transition-all", barColor)}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-3">
          <Field icon={<DollarSign className="w-3.5 h-3.5" />} label="Monthly cost">
            ${agent.monthlyCost.toFixed(2)}
          </Field>
          <Field icon={<Clock className="w-3.5 h-3.5" />} label="Last heartbeat">
            {agent.lastHeartbeat}
          </Field>
          <Field icon={<Bot className="w-3.5 h-3.5" />} label="Current task">
            {agent.currentTask}
          </Field>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border">
        <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-sidebar-primary text-sidebar-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          Edit Agent
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <div className="min-w-0">
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
          {label}
        </div>
        <div className="text-sm text-foreground">{children}</div>
      </div>
    </div>
  );
}

// ─── Node Card ────────────────────────────────────────────────────────────────

interface NodeCardProps {
  agent: Agent;
  position: { x: number; y: number };
  isSelected: boolean;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  onClick: (id: string) => void;
}

function NodeCard({ agent, position, isSelected, onPointerDown, onClick }: NodeCardProps) {
  return (
    <div
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        width: NODE_W,
        height: NODE_H,
        touchAction: "none",
      }}
      className={cn(
        "bg-card/90 backdrop-blur-md border rounded-xl shadow-lg cursor-grab active:cursor-grabbing p-3 select-none transition-shadow",
        isSelected
          ? "border-sidebar-primary/60 shadow-[0_0_0_2px_hsl(var(--sidebar-primary)/0.3)]"
          : "border-border hover:border-border/80 hover:shadow-xl"
      )}
      onPointerDown={(e) => onPointerDown(e, agent.id)}
    >
      <div className="flex items-start gap-2 h-full">
        {/* Status dot */}
        <span
          className={cn("mt-1 w-1.5 h-1.5 rounded-full shrink-0", STATUS_DOT[agent.status])}
        />
        <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
          <div>
            <div className="text-xs font-semibold truncate leading-tight">{agent.name}</div>
            <div className="text-[10px] text-muted-foreground truncate mt-0.5">{agent.role}</div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span
              className={cn(
                "rounded-full text-[10px] px-2 py-0.5 font-medium",
                adapterClass(agent.adapter)
              )}
            >
              {agent.adapter}
            </span>
            <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground tabular-nums">
              <DollarSign className="w-2.5 h-2.5" />
              {agent.monthlyCost.toFixed(0)}/mo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SVG Edges ────────────────────────────────────────────────────────────────

function Edges({ positions }: { positions: Record<string, { x: number; y: number }> }) {
  return (
    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      {EDGES.map(({ from, to }) => {
        const a = positions[from];
        const b = positions[to];
        if (!a || !b) return null;
        const x1 = a.x + NODE_W / 2;
        const y1 = a.y + NODE_H;
        const x2 = b.x + NODE_W / 2;
        const y2 = b.y;
        const cy = (y1 + y2) / 2;
        return (
          <path
            key={`${from}-${to}`}
            d={`M ${x1},${y1} C ${x1},${cy} ${x2},${cy} ${x2},${y2}`}
            stroke="white"
            strokeOpacity="0.2"
            strokeWidth="1.5"
            fill="none"
          />
        );
      })}
    </svg>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function OrgPage() {
  // Pan & zoom state
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  // Node positions
  const [positions, setPositions] =
    useState<Record<string, { x: number; y: number }>>(INITIAL_POSITIONS);

  // Selected node
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Refs for drag logic
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{
    type: "pan" | "node";
    nodeId?: string;
    startPointer: { x: number; y: number };
    startValue: { x: number; y: number };
    moved: boolean;
  } | null>(null);

  // ── Wheel zoom ──────────────────────────────────────────────────────────────
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    setZoom((z) => {
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      return Math.min(2, Math.max(0.4, z * delta));
    });
  }, []);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // ── Pointer events ──────────────────────────────────────────────────────────
  const handleNodePointerDown = useCallback(
    (e: React.PointerEvent, nodeId: string) => {
      e.stopPropagation();
      e.currentTarget.setPointerCapture(e.pointerId);
      dragState.current = {
        type: "node",
        nodeId,
        startPointer: { x: e.clientX, y: e.clientY },
        startValue: { ...positions[nodeId] },
        moved: false,
      };
    },
    [positions]
  );

  const handleCanvasPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.target !== e.currentTarget && (e.target as HTMLElement).closest("[data-node]")) return;
    dragState.current = {
      type: "pan",
      startPointer: { x: e.clientX, y: e.clientY },
      startValue: { x: pan.x, y: pan.y },
      moved: false,
    };
  }, [pan]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const d = dragState.current;
    if (!d) return;
    const dx = e.clientX - d.startPointer.x;
    const dy = e.clientY - d.startPointer.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) d.moved = true;

    if (d.type === "pan") {
      setPan({ x: d.startValue.x + dx, y: d.startValue.y + dy });
    } else if (d.type === "node" && d.nodeId) {
      setPositions((prev) => ({
        ...prev,
        [d.nodeId!]: {
          x: d.startValue.x + dx / zoom,
          y: d.startValue.y + dy / zoom,
        },
      }));
    }
  }, [zoom]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    const d = dragState.current;
    if (!d) return;
    if (d.type === "node" && d.nodeId && !d.moved) {
      setSelectedId((prev) => (prev === d.nodeId ? null : d.nodeId!));
    }
    dragState.current = null;
  }, []);

  // ── Controls ────────────────────────────────────────────────────────────────
  const zoomIn = () => setZoom((z) => Math.min(2, z * 1.2));
  const zoomOut = () => setZoom((z) => Math.max(0.4, z / 1.2));
  const resetView = () => { setPan({ x: 0, y: 0 }); setZoom(1); };
  const fitAll = useCallback(() => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const xs = Object.values(positions).map((p) => p.x);
    const ys = Object.values(positions).map((p) => p.y);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs) + NODE_W;
    const maxY = Math.max(...ys) + NODE_H;
    const contentW = maxX - minX + 80;
    const contentH = maxY - minY + 80;
    const z = Math.min(2, Math.max(0.4, Math.min(rect.width / contentW, rect.height / contentH)));
    setZoom(z);
    setPan({
      x: (rect.width - contentW * z) / 2 - minX * z + 40 * z,
      y: (rect.height - contentH * z) / 2 - minY * z + 40 * z,
    });
  }, [positions]);

  const selectedAgent = selectedId ? AGENTS.find((a) => a.id === selectedId) ?? null : null;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border shrink-0">
        <Network className="w-4 h-4 text-muted-foreground" />
        <h1 className="text-sm font-semibold">Org Chart</h1>
        <span className="text-xs text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded-md">
          {AGENTS.length} agents
        </span>
      </div>

      {/* Main area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Canvas */}
        <div
          ref={canvasRef}
          className="flex-1 relative overflow-hidden"
          style={{ cursor: dragState.current?.type === "pan" ? "grabbing" : "grab" }}
          onPointerDown={handleCanvasPointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Infinite canvas inner */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: "0 0",
            }}
          >
            {/* SVG edges rendered below nodes */}
            <Edges positions={positions} />

            {/* Nodes */}
            {AGENTS.map((agent) => (
              <NodeCard
                key={agent.id}
                agent={agent}
                position={positions[agent.id]}
                isSelected={selectedId === agent.id}
                onPointerDown={handleNodePointerDown}
                onClick={setSelectedId}
              />
            ))}
          </div>

          {/* Controls — bottom right, outside transform */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-1 z-10">
            <ControlButton onClick={zoomIn} title="Zoom in">
              <ZoomIn className="w-3.5 h-3.5" />
            </ControlButton>
            <ControlButton onClick={zoomOut} title="Zoom out">
              <ZoomOut className="w-3.5 h-3.5" />
            </ControlButton>
            <ControlButton onClick={resetView} title="Reset view">
              <RotateCcw className="w-3.5 h-3.5" />
            </ControlButton>
            <ControlButton onClick={fitAll} title="Fit all">
              <Maximize2 className="w-3.5 h-3.5" />
            </ControlButton>
          </div>

          {/* Zoom indicator */}
          <div className="absolute bottom-4 left-4 z-10 text-[10px] text-muted-foreground tabular-nums bg-card/80 backdrop-blur px-2 py-1 rounded-md border border-border">
            {Math.round(zoom * 100)}%
          </div>
        </div>

        {/* Detail panel */}
        {selectedAgent && (
          <DetailPanel agent={selectedAgent} onClose={() => setSelectedId(null)} />
        )}
      </div>
    </div>
  );
}

function ControlButton({
  onClick,
  title,
  children,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-8 h-8 flex items-center justify-center rounded-xl bg-card/90 backdrop-blur-md border border-border shadow-md text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
    >
      {children}
    </button>
  );
}
