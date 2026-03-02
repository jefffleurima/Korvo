"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { placeOutboundCall } from "@/app/actions/calls";

export function CallBackButton({ phone }: { phone: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const normalized = phone.replace(/\D/g, "");
  if (!normalized || normalized.length < 10) return null;

  async function handleClick() {
    setMessage(null);
    setLoading(true);
    const result = await placeOutboundCall(phone);
    setLoading(false);
    if (result.success) {
      setMessage({ type: "success", text: "Call initiated." });
    } else {
      setMessage({ type: "error", text: result.error });
    }
  }

  return (
    <span className="inline-flex items-center gap-1">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="text-black/70 hover:text-black"
        onClick={handleClick}
        disabled={loading}
      >
        <Phone className="mr-1 h-3.5 w-3.5" />
        {loading ? "Calling…" : "Call back"}
      </Button>
      {message && (
        <span className={message.type === "success" ? "text-xs text-green-700" : "text-xs text-red-700"}>
          {message.text}
        </span>
      )}
    </span>
  );
}
