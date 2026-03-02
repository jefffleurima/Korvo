import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Twilio status callback: call ended (completed, no-answer, busy, failed, canceled).
 * Log the call and create a pending lead on missed/no-answer for callback/SMS flow.
 */
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const callSid = String(formData.get("CallSid") ?? "");
  const callStatus = String(formData.get("CallStatus") ?? "");
  const from = String(formData.get("From") ?? "");
  const to = String(formData.get("To") ?? "");
  const duration = parseInt(String(formData.get("Duration") ?? "0"), 10) || null;
  const orgId = request.nextUrl.searchParams.get("orgId") ?? "";

  if (!orgId) {
    return new NextResponse("Missing orgId", { status: 400 });
  }

  const supabase = createAdminClient();

  const terminalStatuses = ["completed", "no-answer", "busy", "canceled", "failed"];
  if (!terminalStatuses.includes(callStatus)) {
    return new NextResponse("OK", { status: 200 });
  }

  const outcome =
    callStatus === "completed"
      ? "booked" // will be updated by real flow; treat as completed for now
      : "missed";

  const { data: existing } = await supabase
    .from("calls")
    .select("id")
    .eq("organization_id", orgId)
    .eq("twilio_call_sid", callSid)
    .maybeSingle();

  if (!existing) {
    const { error: callError } = await supabase.from("calls").insert({
      organization_id: orgId,
      twilio_call_sid: callSid,
      duration: duration ?? 0,
      outcome,
      transcript: null,
      recording_url: null,
    });
    if (callError) console.error("[voice/status] insert call:", callError);

    if (outcome === "missed") {
      const { data: existingLead } = await supabase
        .from("leads")
        .select("id")
        .eq("organization_id", orgId)
        .eq("phone", from)
        .maybeSingle();
      if (!existingLead) {
        await supabase.from("leads").insert({
          organization_id: orgId,
          phone: from,
          qualification_status: "pending",
        });
      }
    }
  }

  return new NextResponse("OK", { status: 200 });
}
