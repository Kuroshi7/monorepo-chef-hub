"use client";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSidebar = pathname !== "/login";

  return showSidebar ? (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gray-50 min-h-screen p-8">{children}</main>
    </div>
  ) : (
    <>{children}</>
  );
}
