import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Phone,
  Sparkles,
  CalendarCheck,
  MessageSquare,
  BarChart3,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: Phone,
    title: "Answer every call",
    description:
      "Inbound calls, forms, SMS—Korvo listens everywhere. No lead slips through when your front desk is busy or after hours. 34% of med spa calls are missed at peak; we answer 24/7.",
  },
  {
    icon: Sparkles,
    title: "Instant AI engagement",
    description:
      "AI answers, calls back, or texts in seconds. Qualifies by treatment interest and timeline. Intake only—no medical or treatment advice; your staff handles that at the consult.",
  },
  {
    icon: BarChart3,
    title: "Intent scoring",
    description:
      "Budget, urgency, conversion probability. High intent → book now, medium → nurture, low → automated follow-up. Humans handle the highest ROI only.",
  },
  {
    icon: CalendarCheck,
    title: "Revenue routing",
    description:
      "High-intent leads book directly. Others stay in the pipeline with the right next step. One missed consult is ~$2,500; we capture them.",
  },
  {
    icon: MessageSquare,
    title: "Missed call recovery",
    description:
      "Missed calls get an immediate callback and SMS follow-up. 68% of callers won’t leave voicemail—we reach them first.",
  },
  {
    icon: Shield,
    title: "CRM + integrations",
    description:
      "Push qualified leads to your CRM via webhook. Calendar, booking, and analytics in one place.",
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-24 bg-white px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center font-serif text-3xl font-semibold tracking-tight text-black md:text-4xl">
          The system: capture, engage, score, route
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-black/60">
          Not an answering service. A revenue optimization layer for med spas.
        </p>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              className="border-black/10 bg-white transition-colors hover:bg-black/[0.02]"
            >
              <CardHeader className="space-y-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-black/15 bg-black/[0.04] text-black">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg font-semibold text-black">
                  {title}
                </CardTitle>
                <CardDescription className="text-base leading-relaxed text-black/70">
                  {description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
