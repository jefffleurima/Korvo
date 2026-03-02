import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SetupFlow } from "@/components/setup/SetupFlow";

export default async function SetupPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("users").select("id").eq("id", user.id).single();
  if (!profile) {
    await supabase.rpc("create_organization_and_user", { org_name: "My Firm" });
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="px-6 pt-12 pb-20">
        <SetupFlow />
      </main>
    </div>
  );
}
