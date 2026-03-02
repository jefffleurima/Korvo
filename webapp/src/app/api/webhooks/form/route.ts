import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Inbound form submission webhook. Creates a lead and optionally triggers callback/SMS later.
 * POST body (JSON): { org_id, name?, phone?, email?, message?, source? }
 * Header: X-Korvo-Webhook-Secret: <org.webhook_secret> (optional if org has no secret set)
 */
export async function POST(request: NextRequest) {
  let body: { org_id?: string; name?: string; phone?: string; email?: string; message?: string; source?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const orgId = body.org_id?.trim();
  if (!orgId) {
    return NextResponse.json({ error: "Missing org_id" }, { status: 400 });
  }

  const secret = request.headers.get("X-Korvo-Webhook-Secret")?.trim();
  const supabase = createAdminClient();

  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .select("id, webhook_secret")
    .eq("id", orgId)
    .single();

  if (orgError || !org) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 });
  }

  if (org.webhook_secret && org.webhook_secret !== secret) {
    return NextResponse.json({ error: "Invalid webhook secret" }, { status: 401 });
  }

  const { error: insertError } = await supabase.from("leads").insert({
    organization_id: orgId,
    name: body.name?.trim() || null,
    phone: body.phone?.trim() || null,
    email: body.email?.trim() || null,
    qualification_status: "pending",
    // Store message or source in a note field if we had one; for now we only have transcript. Skip.
  });

  if (insertError) {
    console.error("[webhooks/form] insert lead:", insertError);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
