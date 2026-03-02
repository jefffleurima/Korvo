"use server";

import { createClient } from "@/lib/supabase/server";
import Twilio from "twilio";

/**
 * Place an outbound call (e.g. missed-call callback). Uses TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.
 * Org's twilio_phone_number is used as caller ID.
 */
export async function placeOutboundCall(to: string): Promise<{ success: true } | { success: false; error: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { data: userRow } = await supabase.from("users").select("organization_id").eq("id", user.id).single();
  if (!userRow?.organization_id) return { success: false, error: "No organization" };

  const { data: org } = await supabase
    .from("organizations")
    .select("twilio_phone_number")
    .eq("id", userRow.organization_id)
    .single();

  const fromNumber = org?.twilio_phone_number?.trim();
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!fromNumber) return { success: false, error: "No Twilio number configured. Set it in Account → Call & phone." };
  if (!accountSid || !authToken) return { success: false, error: "Twilio credentials not configured." };
  if (!baseUrl) return { success: false, error: "NEXT_PUBLIC_APP_URL not set." };

  const twimlUrl = `${baseUrl}/api/voice/outbound-twiml`;

  try {
    const client = Twilio(accountSid, authToken);
    await client.calls.create({
      to: to.replace(/\s/g, ""),
      from: fromNumber,
      url: twimlUrl,
      method: "GET",
    });
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to place call.";
    return { success: false, error: message };
  }
}
