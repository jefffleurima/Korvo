"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Users,
  Phone,
  MessageSquare,
  Calendar,
  BarChart3,
  Sparkles,
  Plug,
  CreditCard,
  UserPlus,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/leads", label: "Leads", icon: Users },
  { href: "/dashboard/calls", label: "Calls", icon: Phone },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { href: "/dashboard/appointments", label: "Appointments", icon: Calendar },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/ai-settings", label: "AI settings", icon: Sparkles },
  { href: "/dashboard/integrations", label: "Integrations", icon: Plug },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/team", label: "Team", icon: UserPlus },
  { href: "/dashboard/account", label: "Account", icon: Settings },
];

export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    if (!confirm("Log out? You’ll need to sign in again to access your account.")) return;
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-56 border-r border-black/10 bg-white">
      <div className="flex h-16 flex-col justify-center border-b border-black/10 px-6">
        <Link href="/dashboard" className="font-semibold text-black">
          KORVO
        </Link>
        <span className="text-[10px] font-medium uppercase tracking-wider text-black/45">Revenue intelligence</span>
      </div>
      <nav className="flex flex-col gap-0.5 p-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive ? "bg-black text-white" : "text-black/70 hover:bg-black/5 hover:text-black"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="absolute bottom-0 left-0 right-0 border-t border-black/10 p-3">
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-black/60 hover:bg-black/5 hover:text-black"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Log out
        </button>
      </div>
    </aside>
  );
}
