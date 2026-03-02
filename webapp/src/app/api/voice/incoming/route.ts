import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Twilio webhook: inbound call. Returns TwiML to ring the human (forwarding number)
 * for call_ring_timeout_seconds; if no answer, Twilio POSTs to no-answer and AI picks up.
 */
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const callSid = String(formData.get("CallSid") ?? "");
  const from = String(formData.get("From") ?? "");
  const to = String(formData.get("To") ?? "").trim();

  const supabase = createAdminClient();
  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .select("id, call_ring_timeout_seconds, forwarding_phone")
    .eq("twilio_phone_number", to)
    .single();

  if (orgError || !org) {
    // No org for this number: respond with simple message and hang up
    const fallback = `<?xml version="1.0" encoding="UTF-8"?><Response><Say>This number is not configured. Goodbye.</Say><Hangup/></Response>`;
    return new NextResponse(fallback, {
      headers: { "Content-Type": "text/xml; charset=utf-8" },
    });
  }

  const timeout = Math.min(Math.max(Number(org.call_ring_timeout_seconds) || 15, 5), 60);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin;
  const noAnswerUrl = `${baseUrl}/api/voice/no-answer?orgId=${org.id}&CallSid=${encodeURIComponent(callSid)}`;
  const statusCallbackUrl = `${baseUrl}/api/voice/status?orgId=${org.id}`;

  let twiml: string;
  if (org.forwarding_phone) {
    // Ring human first; if no answer, Twilio will POST to noAnswerUrl
    twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial timeout="${timeout}" action="${noAnswerUrl}" method="POST" callerId="${to}" statusCallback="${statusCallbackUrl}" statusCallbackEvent="initiated ringing answered completed">
    <Number>${escapeXml(org.forwarding_phone)}</Number>
  </Dial>
</Response>`;
  } else {
    // No forwarding number: send straight to AI
    twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Redirect method="POST">${noAnswerUrl}</Redirect>
</Response>`;
  }

  return new NextResponse(twiml, {
    headers: { "Content-Type": "text/xml; charset=utf-8" },
  });
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
