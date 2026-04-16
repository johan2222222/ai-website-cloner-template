"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Send, Inbox } from "lucide-react";

interface Message {
  from: string;
  time: string;
  text: string;
}

interface Thread {
  id: number;
  agent: string;
  initials: string;
  color: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
  messages: Message[];
}

const INITIAL_THREADS: Thread[] = [
  {
    id: 1,
    agent: "Dev Agent",
    initials: "DA",
    color: "#6366f1",
    subject: "PR Ready for Review",
    preview: "I've completed the OAuth2 PKCE implementation...",
    time: "2m ago",
    unread: true,
    messages: [
      { from: "Dev Agent", time: "2m ago", text: "I've completed the OAuth2 PKCE implementation. The PR is ready for your review. I've added unit tests and updated the docs." },
      { from: "You", time: "1m ago", text: "Great, I'll take a look. Did you handle the token refresh edge case?" },
      { from: "Dev Agent", time: "30s ago", text: "Yes, I added a refresh token rotation mechanism. The edge case where tokens expire mid-request is now handled with automatic retry logic." },
    ],
  },
  {
    id: 2,
    agent: "QA Agent",
    initials: "QA",
    color: "#f59e0b",
    subject: "Test Suite Results",
    preview: "All 247 tests passing. Coverage at 84%...",
    time: "15m ago",
    unread: true,
    messages: [
      { from: "QA Agent", time: "15m ago", text: "All 247 tests are passing. Code coverage is at 84%, up from 71% last sprint. I found 2 edge cases in the payment service that need attention." },
      { from: "You", time: "10m ago", text: "What are the edge cases?" },
      { from: "QA Agent", time: "9m ago", text: "Edge case 1: concurrent payment requests with the same idempotency key. Edge case 2: timeout handling when the payment gateway takes >30s. I've created issues ISS-146 and ISS-147 for these." },
    ],
  },
  {
    id: 3,
    agent: "PM Agent",
    initials: "PM",
    color: "#10b981",
    subject: "Sprint Planning Complete",
    preview: "I've prepared the sprint board for next week...",
    time: "1h ago",
    unread: false,
    messages: [
      { from: "PM Agent", time: "1h ago", text: "Sprint planning is complete. I've prioritized 12 issues for next sprint based on the Q2 goals. The Dev Agent has 6 assigned, QA Agent has 4, and I'll handle 2." },
      { from: "You", time: "50m ago", text: "Looks good. Make sure the security audit tasks are top priority." },
      { from: "PM Agent", time: "48m ago", text: "Understood. I've moved ISS-140 (Audit user permissions) and ISS-142 (Rate limiting) to the top of the queue. The Dev Agent will start on these tomorrow morning." },
    ],
  },
  {
    id: 4,
    agent: "Dev Agent",
    initials: "DA",
    color: "#6366f1",
    subject: "Requesting Approval: Deploy to Production",
    preview: "v2.3.1 is ready for production deployment...",
    time: "2h ago",
    unread: false,
    messages: [
      { from: "Dev Agent", time: "2h ago", text: "v2.3.1 is ready for production deployment. All tests pass, the staging environment has been running for 48h without issues. Requesting approval to proceed." },
      { from: "You", time: "1h 55m ago", text: "I'll review the checklist first. Hold off for now." },
    ],
  },
  {
    id: 5,
    agent: "Docs Agent",
    initials: "DO",
    color: "#ec4899",
    subject: "Error: Documentation Generation Failed",
    preview: "Encountered a permission error when accessing...",
    time: "3h ago",
    unread: true,
    messages: [
      { from: "Docs Agent", time: "3h ago", text: "I encountered a permission error when trying to access the API spec files. Error: EACCES: permission denied, open '/srv/api/openapi.json'. I've paused the task until this is resolved." },
      { from: "You", time: "2h 50m ago", text: "I'll fix the permissions. Can you retry in 30 minutes?" },
      { from: "Docs Agent", time: "30m ago", text: "Retried but still getting the same error. The file permissions were updated but I may need a restart to pick up the changes." },
    ],
  },
  {
    id: 6,
    agent: "QA Agent",
    initials: "QA",
    color: "#f59e0b",
    subject: "Coverage Report - Week 15",
    preview: "Weekly coverage report is ready...",
    time: "1d ago",
    unread: false,
    messages: [
      { from: "QA Agent", time: "1d ago", text: "Weekly coverage report for Week 15 is ready. Overall: 84% (+3%). By module — Auth: 91%, Payments: 78%, API: 87%, Models: 89%. Biggest improvement was in the payment module after the new tests I added." },
    ],
  },
  {
    id: 7,
    agent: "PM Agent",
    initials: "PM",
    color: "#10b981",
    subject: "Budget Alert: Dev Agent at 82%",
    preview: "Dev Agent has used 82% of monthly budget...",
    time: "2d ago",
    unread: false,
    messages: [
      { from: "PM Agent", time: "2d ago", text: "Alert: Dev Agent has consumed 82% of their $150 monthly budget ($123 of $150). At the current burn rate, the budget will be exhausted in approximately 5 days. Recommend either reducing run frequency or increasing the budget limit." },
    ],
  },
];

type Tab = "all" | "unread" | "mentions";

function Avatar({
  initials,
  color,
  size = "md",
}: {
  initials: string;
  color: string;
  size?: "sm" | "md";
}) {
  const sizeClass = size === "sm" ? "w-7 h-7 text-[10px]" : "w-9 h-9 text-xs";
  return (
    <div
      className={cn(
        "flex items-center justify-center font-semibold text-white shrink-0",
        sizeClass
      )}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}

export default function InboxPage() {
  const [threads, setThreads] = useState<Thread[]>(INITIAL_THREADS);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [replyText, setReplyText] = useState("");

  const selectedThread = threads.find((t) => t.id === selectedId) ?? null;

  const filteredThreads = threads.filter((t) => {
    if (activeTab === "unread") return t.unread;
    if (activeTab === "mentions")
      return (
        t.subject.toLowerCase().includes("alert") ||
        t.subject.toLowerCase().includes("error") ||
        t.subject.toLowerCase().includes("mention")
      );
    return true;
  });

  function handleSelectThread(id: number) {
    setSelectedId(id);
    setThreads((prev) =>
      prev.map((t) => (t.id === id ? { ...t, unread: false } : t))
    );
    setReplyText("");
  }

  function handleSend() {
    if (!replyText.trim() || !selectedId) return;
    const newMessage: Message = {
      from: "You",
      time: "just now",
      text: replyText.trim(),
    };
    setThreads((prev) =>
      prev.map((t) =>
        t.id === selectedId
          ? { ...t, messages: [...t.messages, newMessage] }
          : t
      )
    );
    setReplyText("");
  }

  const unreadCount = threads.filter((t) => t.unread).length;

  return (
    <div className="flex h-full w-full overflow-hidden bg-background">
      {/* Left panel */}
      <div className="flex flex-col w-[280px] shrink-0 border-r border-border h-full">
        {/* Header */}
        <div className="px-4 pt-4 pb-0 shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <h1 className="text-base font-semibold text-foreground">Inbox</h1>
            {unreadCount > 0 && (
              <span className="flex items-center justify-center h-4 min-w-4 px-1 text-[10px] font-medium bg-violet-600 text-white">
                {unreadCount}
              </span>
            )}
          </div>
          {/* Tabs */}
          <div className="flex border-b border-border">
            {(["all", "unread", "mentions"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-3 py-2 text-xs font-medium capitalize transition-colors border-b-2 -mb-px",
                  activeTab === tab
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Thread list */}
        <div className="flex-1 overflow-y-auto">
          {filteredThreads.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-xs text-muted-foreground">
              No messages
            </div>
          ) : (
            filteredThreads.map((thread) => (
              <button
                key={thread.id}
                onClick={() => handleSelectThread(thread.id)}
                className={cn(
                  "w-full flex items-start gap-3 px-4 py-3 text-left transition-colors border-b border-border hover:bg-accent/30",
                  selectedId === thread.id && "bg-accent/50"
                )}
              >
                <Avatar
                  initials={thread.initials}
                  color={thread.color}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span
                      className={cn(
                        "text-xs truncate",
                        thread.unread
                          ? "font-semibold text-foreground"
                          : "font-medium text-foreground/80"
                      )}
                    >
                      {thread.agent}
                    </span>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {thread.time}
                    </span>
                  </div>
                  <p
                    className={cn(
                      "text-xs truncate mb-0.5",
                      thread.unread
                        ? "font-medium text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {thread.subject}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {thread.preview}
                  </p>
                </div>
                {thread.unread && (
                  <div
                    className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
                    style={{ backgroundColor: thread.color }}
                  />
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {!selectedThread ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <Inbox className="w-10 h-10 opacity-20" />
            <p className="text-sm">Select a conversation</p>
          </div>
        ) : (
          <>
            {/* Thread header */}
            <div className="flex items-center gap-3 px-5 py-3 border-b border-border shrink-0">
              <Avatar
                initials={selectedThread.initials}
                color={selectedThread.color}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground leading-none mb-1">
                  {selectedThread.agent}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {selectedThread.subject}
                </p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">
                {selectedThread.time}
              </span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">
              {selectedThread.messages.map((msg, i) => {
                const isYou = msg.from === "You";
                return (
                  <div
                    key={i}
                    className={cn("flex gap-3", isYou && "flex-row-reverse")}
                  >
                    <div
                      className="w-7 h-7 flex items-center justify-center text-[10px] font-semibold text-white shrink-0"
                      style={{
                        backgroundColor: isYou
                          ? "#64748b"
                          : selectedThread.color,
                      }}
                    >
                      {isYou ? "Y" : selectedThread.initials}
                    </div>
                    <div
                      className={cn(
                        "flex flex-col max-w-[65%]",
                        isYou && "items-end"
                      )}
                    >
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-xs font-semibold text-foreground">
                          {msg.from}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {msg.time}
                        </span>
                      </div>
                      <div
                        className={cn(
                          "text-sm text-foreground px-3 py-2 leading-relaxed border border-border",
                          isYou ? "bg-accent/60" : "bg-card"
                        )}
                      >
                        {msg.text}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply area */}
            <div className="shrink-0 border-t border-border px-5 py-3 flex items-end gap-3">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Reply to this thread..."
                rows={2}
                className="flex-1 resize-none bg-card border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={!replyText.trim()}
                className="flex items-center gap-1.5 px-3 py-2 bg-foreground text-background text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
              >
                <Send className="w-3 h-3" />
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
