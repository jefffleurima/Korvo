import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardNav } from "@/components/dashboard/DashboardNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("users").select("id").eq("id", user.id).single();
  if (!profile) redirect("/setup");

  return (
    <div className="min-h-screen bg-white">
      <DashboardNav />
      <div className="pl-56">
        {children}
      </div>
    </div>
  );
}
