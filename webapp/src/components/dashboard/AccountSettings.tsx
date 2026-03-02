"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { updateOrganization, updateCallSettings } from "@/app/actions/account";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone } from "lucide-react";
import type { User } from "@supabase/supabase-js";

type Organization = {
  id: string;
  name: string | null;
  website: string | null;
  service_area: string | null;
  minimum_project_value: number | null;
  call_ring_timeout_seconds: number | null;
  forwarding_phone: string | null;
  twilio_phone_number: string | null;
  vapi_assistant_id: string | null;
  vapi_phone_number_id: string | null;
} | null;

export function AccountSettings({
  user,
  organization,
}: {
  user: User;
  organization: Organization;
}) {
  const router = useRouter();
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [orgLoading, setOrgLoading] = useState(false);
  const [orgMessage, setOrgMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [name, setName] = useState(organization?.name ?? "");
  const [website, setWebsite] = useState(organization?.website ?? "");
  const [serviceArea, setServiceArea] = useState(organization?.service_area ?? "");
  const [minimumProjectValue, setMinimumProjectValue] = useState(
    organization?.minimum_project_value != null ? String(organization.minimum_project_value) : ""
  );

  const [callRingTimeout, setCallRingTimeout] = useState(
    organization?.call_ring_timeout_seconds != null ? String(organization.call_ring_timeout_seconds) : "15"
  );
  const [forwardingPhone, setForwardingPhone] = useState(organization?.forwarding_phone ?? "");
  const [twilioPhoneNumber, setTwilioPhoneNumber] = useState(organization?.twilio_phone_number ?? "");
  const [vapiAssistantId, setVapiAssistantId] = useState(organization?.vapi_assistant_id ?? "");
  const [vapiPhoneNumberId, setVapiPhoneNumberId] = useState(organization?.vapi_phone_number_id ?? "");
  const [callSettingsLoading, setCallSettingsLoading] = useState(false);
  const [callSettingsMessage, setCallSettingsMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMessage(null);
    if (newPassword.length < 8) {
      setPasswordMessage({ type: "error", text: "Password must be at least 8 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "Passwords don’t match." });
      return;
    }
    setPasswordLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setPasswordMessage({ type: "success", text: "Password updated." });
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to update password." });
    } finally {
      setPasswordLoading(false);
    }
  }

  async function handleSaveOrganization(e: React.FormEvent) {
    e.preventDefault();
    setOrgMessage(null);
    setOrgLoading(true);
    try {
      await updateOrganization({
        name: name || undefined,
        website: website || undefined,
        service_area: serviceArea || undefined,
        minimum_project_value: minimumProjectValue ? minimumProjectValue : undefined,
      });
      setOrgMessage({ type: "success", text: "Business settings saved." });
      router.refresh();
    } catch (err) {
      setOrgMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to save." });
    } finally {
      setOrgLoading(false);
    }
  }

  async function handleSaveCallSettings(e: React.FormEvent) {
    e.preventDefault();
    setCallSettingsMessage(null);
    setCallSettingsLoading(true);
    try {
      const timeoutNum = parseInt(callRingTimeout, 10);
      await updateCallSettings({
        call_ring_timeout_seconds: Number.isNaN(timeoutNum) ? 15 : timeoutNum,
        forwarding_phone: forwardingPhone.trim() || null,
        twilio_phone_number: twilioPhoneNumber.trim() || null,
        vapi_assistant_id: vapiAssistantId.trim() || null,
        vapi_phone_number_id: vapiPhoneNumberId.trim() || null,
      });
      setCallSettingsMessage({ type: "success", text: "Call settings saved." });
      router.refresh();
    } catch (err) {
      setCallSettingsMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to save." });
    } finally {
      setCallSettingsLoading(false);
    }
  }

  async function handleSaveCallSettings(e: React.FormEvent) {
    e.preventDefault();
    setCallSettingsMessage(null);
    setCallSettingsLoading(true);
    try {
      await updateCallSettings({
        call_ring_timeout_seconds: callRingTimeout ? parseInt(callRingTimeout, 10) : undefined,
        forwarding_phone: forwardingPhone || null,
        twilio_phone_number: twilioPhoneNumber || null,
      });
      setCallSettingsMessage({ type: "success", text: "Call settings saved." });
      router.refresh();
    } catch (err) {
      setCallSettingsMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to save." });
    } finally {
      setCallSettingsLoading(false);
    }
  }

  return (
    <div className="mt-8 space-y-8">
      <Card className="border-black/10">
        <CardHeader>
          <CardTitle className="text-black">Sign-in info</CardTitle>
          <CardDescription className="text-black/70">Email and password for this account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-black">Email</Label>
            <Input value={user.email ?? ""} readOnly className="border-black/20 bg-black/[0.03]" />
          </div>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-black">New password</Label>
              <Input
                type="password"
                placeholder="At least 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border-black/20 bg-white"
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-black">Confirm new password</Label>
              <Input
                type="password"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border-black/20 bg-white"
                autoComplete="new-password"
              />
            </div>
            {passwordMessage && (
              <p className={passwordMessage.type === "success" ? "text-sm text-green-700" : "text-sm text-red-700"}>
                {passwordMessage.text}
              </p>
            )}
            <Button type="submit" disabled={passwordLoading} className="rounded-full bg-black text-white hover:bg-black/90">
              {passwordLoading ? "Updating…" : "Change password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-black/10">
        <CardHeader>
          <CardTitle className="text-black">Business settings</CardTitle>
          <CardDescription className="text-black/70">Your med spa details (used in intake and qualification)</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveOrganization} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-black">Business name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Glow Aesthetics Med Spa"
                className="border-black/20 bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-black">Website</Label>
              <Input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://..."
                className="border-black/20 bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-black">Locations / service area</Label>
              <Input
                value={serviceArea}
                onChange={(e) => setServiceArea(e.target.value)}
                placeholder="e.g. Tampa, FL or Downtown + South"
                className="border-black/20 bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-black">Minimum consult value ($) — optional</Label>
              <Input
                type="number"
                value={minimumProjectValue}
                onChange={(e) => setMinimumProjectValue(e.target.value)}
                placeholder="e.g. 500"
                className="border-black/20 bg-white"
              />
            </div>
            {orgMessage && (
              <p className={orgMessage.type === "success" ? "text-sm text-green-700" : "text-sm text-red-700"}>
                {orgMessage.text}
              </p>
            )}
            <Button type="submit" disabled={orgLoading} className="rounded-full bg-black text-white hover:bg-black/90">
              {orgLoading ? "Saving…" : "Save business settings"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-black/10">
        <CardHeader>
          <CardTitle className="text-black">Call & phone</CardTitle>
          <CardDescription className="text-black/70">
            Ring a human first, then AI answers if no one picks up. Set your Twilio number and optional forwarding number so you never miss a consultation call.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveCallSettings} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-black">Ring human for (seconds)</Label>
              <Input
                type="number"
                min={5}
                max={60}
                value={callRingTimeout}
                onChange={(e) => setCallRingTimeout(e.target.value)}
                placeholder="15"
                className="border-black/20 bg-white"
              />
              <p className="text-xs text-black/50">If no one answers within this time, Korvo AI will pick up (5–60 seconds).</p>
            </div>
            <div className="space-y-2">
              <Label className="text-black">Forwarding number (optional)</Label>
              <Input
                type="tel"
                value={forwardingPhone}
                onChange={(e) => setForwardingPhone(e.target.value)}
                placeholder="+1 512 555 0100"
                className="border-black/20 bg-white"
              />
              <p className="text-xs text-black/50">Phone number to ring first (E.164). Leave empty to have AI answer immediately.</p>
            </div>
            <div className="space-y-2">
              <Label className="text-black">Twilio number (inbound)</Label>
              <Input
                type="tel"
                value={twilioPhoneNumber}
                onChange={(e) => setTwilioPhoneNumber(e.target.value)}
                placeholder="+1 512 555 0199"
                className="border-black/20 bg-white"
              />
              <p className="text-xs text-black/50">Your Twilio number that receives calls. Configure this number&apos;s webhook to: POST /api/voice/incoming</p>
            </div>
            <div className="border-t border-black/10 pt-4 space-y-3">
              <p className="text-sm font-medium text-black/80">Vapi AI (no-answer)</p>
              <p className="text-xs text-amber-700 bg-amber-50 rounded px-2 py-1">Required for Sam to answer: paste both <strong>Vapi Assistant ID</strong> and <strong>Vapi Phone Number ID</strong> below (from dashboard.vapi.ai). If either is missing, callers only hear a short message.</p>
              <p className="text-xs text-black/50">Create an assistant at dashboard.vapi.ai, set Server URL to your Korvo webhook, then paste both IDs here.</p>
              {organization?.name && (
                <p className="text-xs text-black/70 rounded-md bg-black/5 px-2 py-1.5 font-medium">
                  Use this name in your Vapi prompt: <span className="font-semibold">{organization.name}</span> — replace [BUSINESS NAME] with it.
                </p>
              )}
              <div className="space-y-2">
                <Label className="text-black">Vapi Assistant ID</Label>
                <Input
                  type="text"
                  value={vapiAssistantId}
                  onChange={(e) => setVapiAssistantId(e.target.value)}
                  placeholder="e.g. abc123..."
                  className="border-black/20 bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-black">Vapi Phone Number ID</Label>
                <Input
                  type="text"
                  value={vapiPhoneNumberId}
                  onChange={(e) => setVapiPhoneNumberId(e.target.value)}
                  placeholder="From Vapi after linking your Twilio number"
                  className="border-black/20 bg-white"
                />
                <p className="text-xs text-black/50">In Vapi, add your Twilio number (BYOC); use the Phone Number ID shown there.</p>
              </div>
            </div>
            {callSettingsMessage && (
              <p className={callSettingsMessage.type === "success" ? "text-sm text-green-700" : "text-sm text-red-700"}>
                {callSettingsMessage.text}
              </p>
            )}
            <Button type="submit" disabled={callSettingsLoading} className="rounded-full bg-black text-white hover:bg-black/90">
              {callSettingsLoading ? "Saving…" : "Save call settings"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
