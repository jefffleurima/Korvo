"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Phone, Calendar, Webhook, Sparkles, Building2 } from "lucide-react";
import { updateCallSettings } from "@/app/actions/account";

const STEPS = [
  { id: 1, title: "Med spa info", icon: Building2 },
  { id: 2, title: "Connect Twilio", icon: Phone },
  { id: 3, title: "Connect Calendar", icon: Calendar },
  { id: 4, title: "Connect CRM", icon: Webhook },
  { id: 5, title: "AI configuration", icon: Sparkles },
];

export function SetupFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1 state
  const [businessName, setBusinessName] = useState("");
  const [website, setWebsite] = useState("");
  const [treatmentsOffered, setTreatmentsOffered] = useState("");
  const [locationsServed, setLocationsServed] = useState("");

  // Step 2 state (placeholder)
  const [twilioSid, setTwilioSid] = useState("");
  const [twilioToken, setTwilioToken] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Step 4 state (placeholder)
  const [crmWebhookUrl, setCrmWebhookUrl] = useState("");

  async function handleNext() {
    if (step === 2 && phoneNumber.trim()) {
      try {
        await updateCallSettings({
          twilio_phone_number: phoneNumber.trim(),
          forwarding_phone: undefined,
          call_ring_timeout_seconds: undefined,
        });
      } catch {
        // Non-blocking; user can set in Account later
      }
    }
    if (step < 5) {
      setStep(step + 1);
    } else {
      setIsSubmitting(true);
      // Placeholder: no backend. Simulate completion → dashboard.
      setTimeout(() => router.push("/dashboard"), 600);
    }
  }

  function handleBack() {
    if (step > 1) setStep(step - 1);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-black">Set up Korvo</h1>
        <p className="mt-1 text-sm text-black/60">
          Connect your tools and configure automation. You can change these later.
        </p>
      </div>

      {/* Stepper */}
      <div className="mb-10 flex items-center justify-between gap-2">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isActive = step === s.id;
          const isDone = step > s.id;
          return (
            <div key={s.id} className="flex flex-1 items-center">
              <div
                className={`flex flex-col items-center gap-1 ${
                  isActive ? "text-black" : isDone ? "text-black/70" : "text-black/40"
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    isDone
                      ? "border-black bg-black text-white"
                      : isActive
                        ? "border-black bg-white text-black"
                        : "border-black/20 bg-white"
                  }`}
                >
                  {isDone ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <span className="hidden text-xs font-medium sm:block">{s.title}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="mx-1 h-0.5 flex-1 bg-black/20" aria-hidden />
              )}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <Card className="border-black/10 bg-white">
        <CardHeader>
          <CardTitle className="text-lg text-black">{STEPS[step - 1].title}</CardTitle>
          <CardDescription className="text-black/70">
            {step === 1 && "Tell us about your med spa so we can tailor Korvo."}
            {step === 2 && "Connect your Twilio account to receive and make calls."}
            {step === 3 && "Connect Google Calendar so clients can book real availability."}
            {step === 4 && "Send qualified leads to your CRM via webhook."}
            {step === 5 && "Set how Korvo qualifies leads and speaks to callers (no medical advice)."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label className="text-black">Med spa / business name</Label>
                <Input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
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
                <Label className="text-black">Treatments offered</Label>
                <Input
                  value={treatmentsOffered}
                  onChange={(e) => setTreatmentsOffered(e.target.value)}
                  placeholder="e.g. Botox, filler, body contouring, laser, facials"
                  className="border-black/20 bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-black">Locations / service area</Label>
                <Input
                  value={locationsServed}
                  onChange={(e) => setLocationsServed(e.target.value)}
                  placeholder="e.g. Tampa, FL or Downtown + South location"
                  className="border-black/20 bg-white"
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-sm text-black/60">
                You’ll add your Twilio Account SID, Auth Token, and phone number. Real connection will happen when we add the backend.
              </p>
              <div className="space-y-2">
                <Label className="text-black">Account SID</Label>
                <Input
                  value={twilioSid}
                  onChange={(e) => setTwilioSid(e.target.value)}
                  placeholder="AC..."
                  className="border-black/20 bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-black">Auth Token</Label>
                <Input
                  type="password"
                  value={twilioToken}
                  onChange={(e) => setTwilioToken(e.target.value)}
                  placeholder="••••••••"
                  className="border-black/20 bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-black">Phone number</Label>
                <Input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1..."
                  className="border-black/20 bg-white"
                />
              </div>
            </>
          )}

          {step === 3 && (
            <div className="rounded-lg border border-black/10 bg-black/[0.02] p-6 text-center">
              <p className="text-sm text-black/70">
                Google Calendar connection will use OAuth once the backend is connected. For now you can continue to the next step.
              </p>
            </div>
          )}

          {step === 4 && (
            <>
              <div className="space-y-2">
                <Label className="text-black">CRM webhook URL</Label>
                <Input
                  type="url"
                  value={crmWebhookUrl}
                  onChange={(e) => setCrmWebhookUrl(e.target.value)}
                  placeholder="https://your-crm.com/webhook/..."
                  className="border-black/20 bg-white"
                />
              </div>
              <p className="text-sm text-black/60">
                Korvo will POST qualified lead details to this URL. You can add or change it later in settings.
              </p>
            </>
          )}

          {step === 5 && (
            <div className="rounded-lg border border-black/10 bg-black/[0.02] p-6">
              <p className="text-sm text-black/70">
                AI configuration (case types, tone, disqualification rules, intake disclaimers) will live in dashboard settings once the backend is connected. You’re done with setup for now.
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-black/20"
                onClick={handleBack}
              >
                Back
              </Button>
            )}
            <Button
              type="button"
              className="rounded-full bg-black text-white hover:bg-black/90"
              onClick={handleNext}
              disabled={step === 5 && isSubmitting}
            >
              {step === 5 ? (isSubmitting ? "Finishing…" : "Finish setup") : "Continue"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
