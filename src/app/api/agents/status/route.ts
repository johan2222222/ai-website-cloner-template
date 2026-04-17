import { NextRequest, NextResponse } from "next/server";

// Simple in-memory status store (in production this would be Redis/Firebase)
const agentStatus = new Map<string, { status: string; lastPing: number; task: string | null }>();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const agentId = searchParams.get("agentId");

  if (agentId) {
    const status = agentStatus.get(agentId) ?? { status: "unknown", lastPing: 0, task: null };
    return NextResponse.json(status);
  }

  // Return all statuses
  return NextResponse.json(Object.fromEntries(agentStatus));
}

export async function POST(req: NextRequest) {
  const { agentId, status, task } = await req.json();

  if (!agentId) {
    return NextResponse.json({ error: "agentId required" }, { status: 400 });
  }

  agentStatus.set(agentId, { status, lastPing: Date.now(), task: task ?? null });
  return NextResponse.json({ ok: true });
}
