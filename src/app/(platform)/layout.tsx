import { PlatformShell } from "@/components/platform/PlatformShell";
import { Sidebar } from "@/components/platform/Sidebar";

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
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
