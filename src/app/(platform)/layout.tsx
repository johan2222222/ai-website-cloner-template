"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";
import { PlatformShell } from "@/components/platform/PlatformShell";
import { Sidebar } from "@/components/platform/Sidebar";

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div
          className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"
        />
      </div>
    );
  }

  if (!user) return null;

  return (
    <PlatformShell>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </PlatformShell>
  );
}
