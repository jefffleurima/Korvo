import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AccountSettings } from "@/components/dashboard/AccountSettings";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("users").select("id").eq("id", user.id).single();
  if (!profile) redirect("/setup");

  const { data: userRow } = await supabase.from("users").select("organization_id").eq("id", user.id).single();
  let organization: { id: string; name: string | null; website: string | null; service_area: string | null; minimum_project_value: number | null; call_ring_timeout_seconds: number | null; forwarding_phone: string | null; twilio_phone_number: string | null; vapi_assistant_id: string | null; vapi_phone_number_id: string | null } | null = null;
  if (userRow?.organization_id) {
    const res = await supabase
      .from("organizations")
      .select("id, name, website, service_area, minimum_project_value, call_ring_timeout_seconds, forwarding_phone, twilio_phone_number, vapi_assistant_id, vapi_phone_number_id")
      .eq("id", userRow.organization_id)
      .single();
    if (!res.error) organization = res.data;
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold text-black">Account</h1>
      <p className="mt-1 text-sm text-black/60">Sign-in and med spa settings</p>
      <AccountSettings user={user} organization={organization} />
    </main>
  );
}
