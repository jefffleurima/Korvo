import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AISettingsPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold text-black">AI settings</h1>
      <p className="mt-1 text-sm text-black/60">Configure how Korvo qualifies and speaks to callers (no medical advice)</p>

      <Card className="mt-8 max-w-xl border-black/10">
        <CardHeader>
          <CardTitle className="text-black">Configuration</CardTitle>
          <CardDescription className="text-black/70">
            Treatment types, tone, and qualification rules will be available here once the backend is connected. Korvo only does intake and booking—no medical or treatment advice.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-black/60">Placeholder. Connect backend to edit.</p>
        </CardContent>
      </Card>
    </main>
  );
}
