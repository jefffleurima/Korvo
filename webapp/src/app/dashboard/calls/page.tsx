import { dummyCalls } from "@/lib/dummy-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Phone, Play } from "lucide-react";

const outcomeStyles: Record<string, string> = {
  booked: "bg-green-500/15 text-green-800",
  disqualified: "bg-black/10 text-black/70",
  missed: "bg-amber-500/15 text-amber-800",
  voicemail: "bg-black/10 text-black/70",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function CallsPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold text-black">Calls</h1>
      <p className="mt-1 text-sm text-black/60">Call logs with outcome and transcript (dummy data)</p>

      <div className="mt-8 space-y-4">
        {dummyCalls.map((call) => (
          <Card key={call.id} className="border-black/10">
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-black/50" />
                  <span className="font-medium text-black">{call.leadName}</span>
                  <span className="text-sm text-black/50">· {call.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-black/60">{call.duration}</span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                      outcomeStyles[call.outcome]
                    )}
                  >
                    {call.outcome}
                  </span>
                  {call.recordingUrl && (
                    <Button variant="ghost" size="sm" className="gap-1 text-black/70">
                      <Play className="h-3 w-3" /> Play
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-xs text-black/50">{formatDate(call.createdAt)}</p>
            </CardHeader>
            {call.transcript && (
              <CardContent className="pt-0">
                <p className="text-sm text-black/70">{call.transcript}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </main>
  );
}
