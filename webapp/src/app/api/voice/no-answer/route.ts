import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const VAPI_CREATE_CALL_URL = "https://api.vapi.ai/call";

const FALLBACK_TWIML = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Thank you for calling. Our virtual assistant will help you in a moment. Please hold.</Say>
  <Pause length="2"/>
  <Say voice="alice">If you're calling about a consultation or treatment, we'll take your information and have someone follow up shortly. Goodbye for now.</Say>
  <Hangup/>
</Response>`;

/**
 * Twilio webhook: human did not pick up. Connect caller to Vapi AI (if configured),
 * otherwise play a short message and hang up.
 */
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const from = String(formData.get("From") ?? "").trim();
  const orgId = request.nextUrl.searchParams.get("orgId") ?? "";

  const apiKey = process.env.VAPI_API_KEY;
  console.log("[voice/no-answer] orgId:", orgId, "from:", from, "hasApiKey:", !!apiKey);
  if (!orgId || !from) {
    console.log("[voice/no-answer] Missing orgId or from, using fallback");
    return new NextResponse(FALLBACK_TWIML, {
      headers: { "Content-Type": "text/xml; charset=utf-8" },
    });
  }

  const supabase = createAdminClient();
  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .select("id, vapi_assistant_id, vapi_phone_number_id")
    .eq("id", orgId)
    .single();

  if (orgError || !org?.vapi_assistant_id || !org?.vapi_phone_number_id || !apiKey) {
    console.log("[voice/no-answer] No Vapi config:", { orgError: !!orgError, hasAssistantId: !!org?.vapi_assistant_id, hasPhoneNumberId: !!org?.vapi_phone_number_id });
    return new NextResponse(FALLBACK_TWIML, {
      headers: { "Content-Type": "text/xml; charset=utf-8" },
    });
  }

  try {
    console.log("[voice/no-answer] Calling Vapi create-call for assistant:", org.vapi_assistant_id);
    const res = await fetch(VAPI_CREATE_CALL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        assistantId: org.vapi_assistant_id,
        phoneNumberId: org.vapi_phone_number_id,
        phoneCallProviderBypassEnabled: true,
        customer: { number: from },
        metadata: { orgId: org.id },
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error("[voice/no-answer] Vapi create call failed:", res.status, errBody);
      return new NextResponse(FALLBACK_TWIML, {
        headers: { "Content-Type": "text/xml; charset=utf-8" },
      });
    }

    const data = (await res.json()) as {
      phoneCallProviderDetails?: { twiml?: string };
    };
    const twiml = data?.phoneCallProviderDetails?.twiml;
    if (!twiml || typeof twiml !== "string") {
      console.error("[voice/no-answer] Vapi response missing twiml:", JSON.stringify(data)?.slice(0, 500));
      return new NextResponse(FALLBACK_TWIML, {
        headers: { "Content-Type": "text/xml; charset=utf-8" },
      });
    }

    console.log("[voice/no-answer] Vapi OK, returning TwiML length:", twiml?.length);
    return new NextResponse(twiml, {
      headers: { "Content-Type": "text/xml; charset=utf-8" },
    });
  } catch (err) {
    console.error("[voice/no-answer] Vapi request error:", err);
    return new NextResponse(FALLBACK_TWIML, {
      headers: { "Content-Type": "text/xml; charset=utf-8" },
    });
  }
}
