"use server";

import { createClient } from "@/lib/supabase/server";

export async function createOrganizationAndUser(orgName: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase.rpc("create_organization_and_user", {
    org_name: orgName || "My Firm",
  });

  if (error) throw new Error(error.message);
  return { organizationId: data };
}
