import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Paperclip — The human control plane for AI labor",
  description: "Hire AI employees, set goals, automate jobs and your business runs itself.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full h-full bg-background text-foreground">{children}</body>
    </html>
  );
}
