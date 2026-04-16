"use client";

import { useState } from "react";
import { Modal, FormField, Input, Textarea, Select, ModalFooter, Btn } from "./Modal";

/* ─── New Issue Modal ────────────────────────────────────────────── */
interface NewIssueModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (issue: { title: string; agent: string; priority: string; project: string; description: string }) => void;
}

export function NewIssueModal({ open, onClose, onSubmit }: NewIssueModalProps) {
  const [form, setForm] = useState({ title: "", agent: "Dev Agent", priority: "medium", project: "Backend Infra", description: "" });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    onSubmit(form);
    setForm({ title: "", agent: "Dev Agent", priority: "medium", project: "Backend Infra", description: "" });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="New Issue" description="Create a new task for an agent to work on">
      <div className="space-y-4">
        <FormField label="Title" required>
          <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="What needs to be done?" autoFocus onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Priority">
            <Select value={form.priority} onChange={(e) => set("priority", e.target.value)}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Select>
          </FormField>
          <FormField label="Assign to">
            <Select value={form.agent} onChange={(e) => set("agent", e.target.value)}>
              <option>Dev Agent</option>
              <option>QA Agent</option>
              <option>PM Agent</option>
              <option>Docs Agent</option>
              <option>Deploy Agent</option>
            </Select>
          </FormField>
        </div>
        <FormField label="Project">
          <Select value={form.project} onChange={(e) => set("project", e.target.value)}>
            <option>Backend Infra</option>
            <option>Mobile App</option>
            <option>Marketing Site</option>
          </Select>
        </FormField>
        <FormField label="Description">
          <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Additional context..." rows={3} />
        </FormField>
        <ModalFooter>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn onClick={handleSubmit} disabled={!form.title.trim()}>Create Issue</Btn>
        </ModalFooter>
      </div>
    </Modal>
  );
}

/* ─── New Agent Modal ────────────────────────────────────────────── */
interface NewAgentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (agent: { name: string; role: string; adapter: string; budget: number }) => void;
}

export function NewAgentModal({ open, onClose, onSubmit }: NewAgentModalProps) {
  const [form, setForm] = useState({ name: "", role: "", adapter: "claude-code", budget: "100" });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.name.trim() || !form.role.trim()) return;
    onSubmit({ name: form.name, role: form.role, adapter: form.adapter, budget: Number(form.budget) });
    setForm({ name: "", role: "", adapter: "claude-code", budget: "100" });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="New Agent" description="Hire a new AI employee for your team">
      <div className="space-y-4">
        <FormField label="Agent name" required>
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Frontend Agent" autoFocus />
        </FormField>
        <FormField label="Role / Job title" required>
          <Input value={form.role} onChange={(e) => set("role", e.target.value)} placeholder="e.g. Frontend Engineer" />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Adapter">
            <Select value={form.adapter} onChange={(e) => set("adapter", e.target.value)}>
              <option value="claude-code">claude-code</option>
              <option value="claude-api">claude-api</option>
              <option value="bash">bash</option>
              <option value="cursor">cursor</option>
              <option value="openai">openai</option>
            </Select>
          </FormField>
          <FormField label="Monthly budget ($)">
            <Input type="number" value={form.budget} onChange={(e) => set("budget", e.target.value)} min="0" max="1000" />
          </FormField>
        </div>
        <div className="bg-muted/40 border border-border p-3 text-xs text-muted-foreground">
          <strong className="text-foreground">Note:</strong> The agent will start paused. Enable it from the Agents page once configured.
        </div>
        <ModalFooter>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn onClick={handleSubmit} disabled={!form.name.trim() || !form.role.trim()}>Hire Agent</Btn>
        </ModalFooter>
      </div>
    </Modal>
  );
}

/* ─── New Project Modal ──────────────────────────────────────────── */
interface NewProjectModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (project: { name: string; description: string; color: string }) => void;
}

export function NewProjectModal({ open, onClose, onSubmit }: NewProjectModalProps) {
  const [form, setForm] = useState({ name: "", description: "", color: "#6366f1" });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const COLORS = ["#6366f1", "#f59e0b", "#10b981", "#3b82f6", "#ec4899", "#8b5cf6", "#f97316", "#14b8a6"];

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    onSubmit(form);
    setForm({ name: "", description: "", color: "#6366f1" });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="New Project" description="Create a new project to organise work">
      <div className="space-y-4">
        <FormField label="Project name" required>
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. API v3" autoFocus />
        </FormField>
        <FormField label="Description">
          <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="What is this project about?" rows={2} />
        </FormField>
        <FormField label="Color">
          <div className="flex gap-2 flex-wrap">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => set("color", c)}
                className="w-7 h-7 rounded-full border-2 transition-all"
                style={{
                  backgroundColor: c,
                  borderColor: form.color === c ? "white" : "transparent",
                  transform: form.color === c ? "scale(1.15)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </FormField>
        <ModalFooter>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn onClick={handleSubmit} disabled={!form.name.trim()}>Create Project</Btn>
        </ModalFooter>
      </div>
    </Modal>
  );
}

/* ─── New Goal Modal ─────────────────────────────────────────────── */
interface NewGoalModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (goal: { title: string; description: string; owner: string; dueDate: string; priority: string }) => void;
}

export function NewGoalModal({ open, onClose, onSubmit }: NewGoalModalProps) {
  const [form, setForm] = useState({ title: "", description: "", owner: "Dev Agent", dueDate: "", priority: "medium" });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    onSubmit(form);
    setForm({ title: "", description: "", owner: "Dev Agent", dueDate: "", priority: "medium" });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="New Goal" description="Set a high-level objective for your team">
      <div className="space-y-4">
        <FormField label="Goal title" required>
          <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="What do you want to achieve?" autoFocus />
        </FormField>
        <FormField label="Description">
          <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Success criteria, context..." rows={2} />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Owner agent">
            <Select value={form.owner} onChange={(e) => set("owner", e.target.value)}>
              <option>Dev Agent</option>
              <option>QA Agent</option>
              <option>PM Agent</option>
              <option>Docs Agent</option>
            </Select>
          </FormField>
          <FormField label="Priority">
            <Select value={form.priority} onChange={(e) => set("priority", e.target.value)}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Select>
          </FormField>
        </div>
        <FormField label="Due date">
          <Input type="date" value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)} />
        </FormField>
        <ModalFooter>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn onClick={handleSubmit} disabled={!form.title.trim()}>Create Goal</Btn>
        </ModalFooter>
      </div>
    </Modal>
  );
}

/* ─── New Routine Modal ──────────────────────────────────────────── */
interface NewRoutineModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (routine: { name: string; description: string; agent: string; schedule: string }) => void;
}

export function NewRoutineModal({ open, onClose, onSubmit }: NewRoutineModalProps) {
  const [form, setForm] = useState({ name: "", description: "", agent: "Dev Agent", schedule: "daily" });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const scheduleLabels: Record<string, string> = {
    daily: "Every day at 9:00 AM",
    weekly_mon: "Every Monday at 8:00 AM",
    weekly_fri: "Every Friday at 5:00 PM",
    biweekly: "Every 2 weeks on Monday",
    monthly: "First day of every month",
    midnight: "Every day at midnight",
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    onSubmit({ ...form, schedule: scheduleLabels[form.schedule] });
    setForm({ name: "", description: "", agent: "Dev Agent", schedule: "daily" });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="New Routine" description="Automate recurring tasks for your agents">
      <div className="space-y-4">
        <FormField label="Routine name" required>
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Daily standup summary" autoFocus />
        </FormField>
        <FormField label="Description">
          <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="What should the agent do?" rows={2} />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Assigned agent">
            <Select value={form.agent} onChange={(e) => set("agent", e.target.value)}>
              <option>Dev Agent</option>
              <option>QA Agent</option>
              <option>PM Agent</option>
              <option>Docs Agent</option>
            </Select>
          </FormField>
          <FormField label="Schedule">
            <Select value={form.schedule} onChange={(e) => set("schedule", e.target.value)}>
              <option value="daily">Daily</option>
              <option value="weekly_mon">Weekly (Mon)</option>
              <option value="weekly_fri">Weekly (Fri)</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
              <option value="midnight">Daily at midnight</option>
            </Select>
          </FormField>
        </div>
        <ModalFooter>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn onClick={handleSubmit} disabled={!form.name.trim()}>Create Routine</Btn>
        </ModalFooter>
      </div>
    </Modal>
  );
}
