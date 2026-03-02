import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

type VapiEndOfCallMessage = {
  type: "end-of-call-report";
  call?: {
    id?: string;
    from?: { phoneNumber?: string };
    endedReason?: string;
    recordingUrl?: string;
    metadata?: { orgId?: string; organizationId?: string };
  };
  metadata?: { orgId?: string; organizationId?: string };
  transcript?: string;
  summary?: string;
};

type VapiWebhookBody = {
  message?: VapiEndOfCallMessage;
};

/**
 * Vapi webhook: end-of-call-report. Creates or updates lead from conversation (transcript/summary).
 * Set this URL in your Vapi assistant Server URL: {NEXT_PUBLIC_APP_URL}/api/webhooks/vapi
 */
export async function POST(request: NextRequest) {
  let body: VapiWebhookBody;
  try {
    body = await request.json();
  } catch {
    return new NextResponse("Bad request", { status: 400 });
  }

  const message = body?.message;
  if (!message || message.type !== "end-of-call-report") {
    return new NextResponse("OK", { status: 200 });
  }

  const orgId =
    message.call?.metadata?.orgId ??
    message.call?.metadata?.organizationId ??
    message.metadata?.orgId ??
    message.metadata?.organizationId;
  const phone = message.call?.from?.phoneNumber ?? null;
  if (!orgId || !phone) {
    return new NextResponse("OK", { status: 200 });
  }

  const supabase = createAdminClient();
  const transcript = message.transcript ?? null;
  const summary = message.summary ?? null;
  const recordingUrl = message.call?.recordingUrl ?? null;

  // Upsert lead by org + phone; attach transcript/summary
  const { data: existing } = await supabase
    .from("leads")
    .select("id")
    .eq("organization_id", orgId)
    .eq("phone", phone)
    .maybeSingle();

  if (existing) {
    await supabase.from("leads").update({ qualification_status: "pending" }).eq("id", existing.id);
  } else {
    await supabase.from("leads").insert({
      organization_id: orgId,
      phone,
      qualification_status: "pending",
    });
  }

  // Log the call (Vapi call, not Twilio) so it appears in dashboard
  const { data: leadRow } = await supabase
    .from("leads")
    .select("id")
    .eq("organization_id", orgId)
    .eq("phone", phone)
    .single();

  const vapiCallId = message.call?.id;
  if (leadRow && vapiCallId) {
    const sid = `vapi-${vapiCallId}`;
    const { data: existingCall } = await supabase
      .from("calls")
      .select("id")
      .eq("organization_id", orgId)
      .eq("twilio_call_sid", sid)
      .maybeSingle();
    if (!existingCall) {
      await supabase.from("calls").insert({
        organization_id: orgId,
        lead_id: leadRow.id,
        twilio_call_sid: sid,
        duration: 0,
        outcome: "missed",
        transcript: transcript ?? summary,
        recording_url: recordingUrl,
      });
    }
  }

  return new NextResponse("OK", { status: 200 });
}
