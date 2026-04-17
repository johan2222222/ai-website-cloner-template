import { ref, set, get, push, update, remove, onValue, off } from "firebase/database";
import { db } from "./firebase";

// ─── Agents ─────────────────────────────────────────────────────────────
export async function getAgents(uid: string) {
  const snap = await get(ref(db, `agents/${uid}`));
  if (!snap.exists()) return [];
  return Object.entries(snap.val()).map(([id, val]) => ({ id, ...(val as object) }));
}

export async function saveAgent(uid: string, agent: object) {
  const agentRef = push(ref(db, `agents/${uid}`));
  await set(agentRef, agent);
  return agentRef.key;
}

export async function updateAgent(uid: string, agentId: string, updates: object) {
  await update(ref(db, `agents/${uid}/${agentId}`), updates);
}

export async function deleteAgent(uid: string, agentId: string) {
  await remove(ref(db, `agents/${uid}/${agentId}`));
}

// ─── Issues ──────────────────────────────────────────────────────────────
export async function getIssues(uid: string) {
  const snap = await get(ref(db, `issues/${uid}`));
  if (!snap.exists()) return [];
  return Object.entries(snap.val()).map(([id, val]) => ({ id, ...(val as object) }));
}

export async function saveIssue(uid: string, issue: object) {
  const issueRef = push(ref(db, `issues/${uid}`));
  await set(issueRef, issue);
  return issueRef.key;
}

export async function updateIssue(uid: string, issueId: string, updates: object) {
  await update(ref(db, `issues/${uid}/${issueId}`), updates);
}

// ─── Inbox ───────────────────────────────────────────────────────────────
export async function getInboxItems(uid: string) {
  const snap = await get(ref(db, `inbox/${uid}`));
  if (!snap.exists()) return [];
  return Object.entries(snap.val()).map(([id, val]) => ({ id, ...(val as object) }));
}

// ─── Real-time listener helper ──────────────────────────────────────────
export function subscribeToAgents(uid: string, callback: (agents: object[]) => void) {
  const agentsRef = ref(db, `agents/${uid}`);
  onValue(agentsRef, (snap) => {
    if (!snap.exists()) {
      callback([]);
      return;
    }
    const agents = Object.entries(snap.val()).map(([id, val]) => ({ id, ...(val as object) }));
    callback(agents);
  });
  return () => off(agentsRef);
}

// ─── Tasks / Agent execution log ─────────────────────────────────────────
export async function saveTask(
  uid: string,
  task: { agentId: string; prompt: string; model: string; status: string }
) {
  const taskRef = push(ref(db, `tasks/${uid}`));
  await set(taskRef, { ...task, createdAt: Date.now() });
  return taskRef.key;
}

export async function updateTask(uid: string, taskId: string, updates: object) {
  await update(ref(db, `tasks/${uid}/${taskId}`), updates);
}
