import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TeamPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold text-black">Team</h1>
      <p className="mt-1 text-sm text-black/60">Manage team members and roles</p>

      <Card className="mt-8 max-w-xl border-black/10">
        <CardHeader>
          <CardTitle className="text-black">Members</CardTitle>
          <CardDescription className="text-black/70">
            Owner and admin roles. Multi-user support will be added with the backend.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-black/60">Placeholder. No members list yet.</p>
        </CardContent>
      </Card>
    </main>
  );
}
