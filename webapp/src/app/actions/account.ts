"use server";

import { createClient } from "@/lib/supabase/server";

export async function updateOrganization(formData: {
  name?: string;
  website?: string;
  service_area?: string;
  minimum_project_value?: string | number;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: userRow } = await supabase.from("users").select("organization_id").eq("id", user.id).single();
  if (!userRow?.organization_id) throw new Error("No organization");

  const payload: Record<string, unknown> = {};
  if (formData.name !== undefined) payload.name = formData.name;
  if (formData.website !== undefined) payload.website = formData.website || null;
  if (formData.service_area !== undefined) payload.service_area = formData.service_area || null;
  if (formData.minimum_project_value !== undefined) {
    const num = typeof formData.minimum_project_value === "string" ? parseFloat(formData.minimum_project_value) : formData.minimum_project_value;
    payload.minimum_project_value = Number.isNaN(num) ? null : num;
  }

  const { error } = await supabase
    .from("organizations")
    .update(payload)
    .eq("id", userRow.organization_id);

  if (error) throw new Error(error.message);
}

export async function updateCallSettings(formData: {
  call_ring_timeout_seconds?: number;
  forwarding_phone?: string | null;
  twilio_phone_number?: string | null;
  vapi_assistant_id?: string | null;
  vapi_phone_number_id?: string | null;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: userRow } = await supabase.from("users").select("organization_id").eq("id", user.id).single();
  if (!userRow?.organization_id) throw new Error("No organization");

  const payload: Record<string, unknown> = {};
  if (formData.call_ring_timeout_seconds !== undefined) {
    const n = Number(formData.call_ring_timeout_seconds);
    payload.call_ring_timeout_seconds = Math.min(60, Math.max(5, Number.isNaN(n) ? 15 : n));
  }
  if (formData.forwarding_phone !== undefined) payload.forwarding_phone = formData.forwarding_phone || null;
  if (formData.twilio_phone_number !== undefined) payload.twilio_phone_number = formData.twilio_phone_number || null;
  if (formData.vapi_assistant_id !== undefined) payload.vapi_assistant_id = formData.vapi_assistant_id?.trim() || null;
  if (formData.vapi_phone_number_id !== undefined) payload.vapi_phone_number_id = formData.vapi_phone_number_id?.trim() || null;

  const { error } = await supabase
    .from("organizations")
    .update(payload)
    .eq("id", userRow.organization_id);

  if (error) throw new Error(error.message);
}
