import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BillingPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold text-black">Billing</h1>
      <p className="mt-1 text-sm text-black/60">Subscription and payment</p>

      <Card className="mt-8 max-w-xl border-black/10">
        <CardHeader>
          <CardTitle className="text-black">Current plan</CardTitle>
          <CardDescription className="text-black/70">
            Dummy status. Stripe integration will live here.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-black/70">
          <p>Plan: Pro</p>
          <p>Status: Active</p>
          <p>Next billing: —</p>
        </CardContent>
      </Card>
    </main>
  );
}
