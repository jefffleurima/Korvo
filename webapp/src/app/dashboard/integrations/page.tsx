import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Calendar, Webhook, ExternalLink } from "lucide-react";

export default async function IntegrationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: userRow } = await supabase.from("users").select("organization_id").eq("id", user.id).single();
  if (!userRow?.organization_id) redirect("/setup");

  const { data: org } = await supabase
    .from("organizations")
    .select("twilio_phone_number, webhook_secret, vapi_assistant_id, vapi_phone_number_id")
    .eq("id", userRow.organization_id)
    .single();

  const voiceConnected = !!org?.twilio_phone_number?.trim();
  const vapiConnected = !!(org?.vapi_assistant_id?.trim() && org?.vapi_phone_number_id?.trim());
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://your-domain.com";
  const vapiWebhookUrl = `${baseUrl}/api/webhooks/vapi`;

  const integrations = [
    {
      name: "Twilio (Voice & SMS)",
      description: "Inbound calls, no-answer AI, outbound callbacks",
      icon: Phone,
      status: voiceConnected ? "Connected" : "Not connected",
      statusStyle: voiceConnected ? "bg-green-500/15 text-green-800" : "bg-amber-500/15 text-amber-800",
      action: "Configure in Account → Call & phone",
      href: "/dashboard/account",
    },
    {
      name: "Vapi (No-answer AI)",
      description: "Conversational AI when no one picks up",
      icon: Phone,
      status: vapiConnected ? "Connected" : "Not connected",
      statusStyle: vapiConnected ? "bg-green-500/15 text-green-800" : "bg-amber-500/15 text-amber-800",
      action: "Set in Vapi assistant → Server URL",
      href: "/dashboard/account",
      detail: `Server URL: ${vapiWebhookUrl}`,
    },
    {
      name: "Google Calendar",
      description: "Availability and booking",
      icon: Calendar,
      status: "Coming soon",
      statusStyle: "bg-black/10 text-black/60",
      action: "Connect in setup",
      href: "/dashboard/account",
    },
    {
      name: "Form webhook",
      description: "Send leads from your website form to Korvo",
      icon: Webhook,
      status: "Ready",
      statusStyle: "bg-green-500/15 text-green-800",
      action: `POST ${baseUrl}/api/webhooks/form`,
      href: null,
      detail: "Body: { \"org_id\": \"<your-org-id>\", \"name\", \"phone\", \"email\" }. Header: X-Korvo-Webhook-Secret (if set in Account).",
    },
  ];

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold text-black">Integrations</h1>
      <p className="mt-1 text-sm text-black/60">Connected tools and API endpoints. Configure in Account.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {integrations.map(({ name, description, icon: Icon, status, statusStyle, action, href, detail }) => (
          <Card key={name} className="border-black/10">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-black/10 bg-black/[0.02]">
                  <Icon className="h-5 w-5 text-black/70" />
                </div>
                <div>
                  <CardTitle className="text-base text-black">{name}</CardTitle>
                  <CardDescription className="text-black/60">{description}</CardDescription>
                </div>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyle}`}>
                {status}
              </span>
            </CardHeader>
            {(action || detail) && (
              <CardContent className="pt-0">
                {href ? (
                  <Link
                    href={href}
                    className="inline-flex items-center gap-1 text-sm font-medium text-black/80 hover:text-black"
                  >
                    {action}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                ) : (
                  <p className="text-xs text-black/60 font-mono break-all">{action}</p>
                )}
                {detail && <p className="mt-2 text-xs text-black/50">{detail}</p>}
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </main>
  );
}
