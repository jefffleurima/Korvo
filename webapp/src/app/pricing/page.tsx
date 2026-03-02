import Link from "next/link";
import { Header } from "@/components/landing/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="px-6 pt-32 pb-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-black md:text-4xl">
            Pricing
          </h1>
          <p className="mt-3 text-black/70">
            Simple pricing per location. No long-term contract.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
          <Card className="border-black/10 bg-black/[0.02]">
            <CardHeader>
              <CardTitle className="text-black">Setup</CardTitle>
              <CardDescription className="text-black/70">
                One-time (optional)
              </CardDescription>
              <p className="font-serif text-3xl font-semibold text-black">
                $500 – $1,500
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-black/70">
                Configuration, Twilio and calendar connection, AI tuning for your med spa.
              </p>
            </CardContent>
          </Card>
          <Card className="border-black/10 bg-black/[0.02]">
            <CardHeader>
              <CardTitle className="text-black">Monthly</CardTitle>
              <CardDescription className="text-black/70">
                Per location
              </CardDescription>
              <p className="font-serif text-3xl font-semibold text-black">
                $300 – $800<span className="text-lg font-normal text-black/70">/mo</span>
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-black/70">
                Unlimited calls, leads, and bookings. Answer 24/7. Never miss a consultation.
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="mx-auto mt-12 max-w-md text-center">
          <Button asChild size="lg" className="rounded-full bg-black px-8 text-white hover:bg-black/90">
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
