import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

type VapiEndOfCallMessage = {
  type: "end-of-call-report";
  call?: {
    id?: string;
    assistantId?: string;
    from?: { phoneNumber?: string };
    endedReason?: string;
    recordingUrl?: string;
    metadata?: Record<string, unknown> & { orgId?: string; organizationId?: string };
  };
  metadata?: { orgId?: string; organizationId?: string };
  transcript?: string;
  summary?: string;
  artifact?: { transcript?: string; recording?: { url?: string } };
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

  let orgId: string | null =
    (message.call?.metadata?.orgId as string | undefined) ??
    (message.call?.metadata?.organizationId as string | undefined) ??
    message.metadata?.orgId ??
    message.metadata?.organizationId ??
    null;
  const phone = message.call?.from?.phoneNumber ?? null;

  const supabase = createAdminClient();

  // If no orgId from metadata, look up org by assistantId (Vapi may not echo custom metadata in webhook)
  if (!orgId && message.call?.assistantId) {
    const { data: orgByAssistant } = await supabase
      .from("organizations")
      .select("id")
      .eq("vapi_assistant_id", message.call.assistantId)
      .maybeSingle();
    if (orgByAssistant) orgId = orgByAssistant.id;
  }

  if (!orgId || !phone) {
    console.warn("[vapi/webhook] Missing orgId or phone:", { orgId: !!orgId, phone: !!phone, hasAssistantId: !!message.call?.assistantId });
    return new NextResponse("OK", { status: 200 });
  }

  const transcript = message.transcript ?? message.artifact?.transcript ?? null;
  const summary = message.summary ?? null;
  const recordingUrl = message.call?.recordingUrl ?? message.artifact?.recording?.url ?? null;

  // Upsert lead by org + phone
  const { data: existing } = await supabase
    .from("leads")
    .select("id")
    .eq("organization_id", orgId)
    .eq("phone", phone)
    .maybeSingle();

  if (existing) {
    const { error: updateErr } = await supabase.from("leads").update({ qualification_status: "pending" }).eq("id", existing.id);
    if (updateErr) console.error("[vapi/webhook] Lead update error:", updateErr.message);
  } else {
    const { error: insertErr } = await supabase.from("leads").insert({
      organization_id: orgId,
      phone,
      qualification_status: "pending",
    });
    if (insertErr) {
      console.error("[vapi/webhook] Lead insert error:", insertErr.message);
      return new NextResponse("OK", { status: 200 });
    }
  }

  // Log the call so it appears in dashboard
  const { data: leadRow, error: leadErr } = await supabase
    .from("leads")
    .select("id")
    .eq("organization_id", orgId)
    .eq("phone", phone)
    .single();

  if (leadErr) {
    console.error("[vapi/webhook] Lead lookup after upsert:", leadErr.message);
    return new NextResponse("OK", { status: 200 });
  }

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
      const { error: callInsertErr } = await supabase.from("calls").insert({
        organization_id: orgId,
        lead_id: leadRow.id,
        twilio_call_sid: sid,
        duration: 0,
        outcome: "missed",
        transcript: transcript ?? summary,
        recording_url: recordingUrl,
      });
      if (callInsertErr) console.error("[vapi/webhook] Call insert error:", callInsertErr.message);
    }
  }

  return new NextResponse("OK", { status: 200 });
}
