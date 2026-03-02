import { NextResponse } from "next/server";

/**
 * TwiML played when an outbound callback is answered. Can be extended to connect to queue or AI.
 */
export async function GET() {
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Thank you for calling back. A team member will be with you shortly. Please hold.</Say>
  <Pause length="3"/>
  <Say voice="alice">If this is regarding a consultation or appointment, we have your information and will follow up. Goodbye.</Say>
  <Hangup/>
</Response>`;

  return new NextResponse(twiml, {
    headers: { "Content-Type": "text/xml; charset=utf-8" },
  });
}
