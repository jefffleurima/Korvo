import { dummyMessages } from "@/lib/dummy-data";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Send } from "lucide-react";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MessagesPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold text-black">Messages</h1>
      <p className="mt-1 text-sm text-black/60">Unified SMS inbox (dummy data)</p>

      <div className="mt-8 space-y-4">
        {dummyMessages.map((msg) => (
          <Card
            key={msg.id}
            className={msg.direction === "outbound" ? "ml-8 border-black/10 bg-black/[0.02]" : "mr-8 border-black/10"}
          >
            <CardContent className="flex gap-3 py-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/10">
                {msg.direction === "inbound" ? (
                  <MessageCircle className="h-4 w-4 text-black/70" />
                ) : (
                  <Send className="h-4 w-4 text-black/70" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-xs text-black/50">
                  <span className="font-medium capitalize">{msg.direction}</span>
                  <span>·</span>
                  <span>{msg.phone}</span>
                  <span>·</span>
                  <span>{formatDate(msg.createdAt)}</span>
                </div>
                <p className="mt-1 text-sm text-black/90">{msg.content}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
