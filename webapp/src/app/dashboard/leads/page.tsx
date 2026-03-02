import { dummyLeads } from "@/lib/dummy-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CallBackButton } from "@/components/dashboard/CallBackButton";

const statusStyles: Record<string, string> = {
  qualified: "bg-green-500/15 text-green-800",
  pending: "bg-amber-500/15 text-amber-800",
  disqualified: "bg-black/10 text-black/70",
};

export default function LeadsPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold text-black">Leads</h1>
      <p className="mt-1 text-sm text-black/60">Consultation inquiries from calls and forms (dummy data)</p>

      <Card className="mt-8 border-black/10 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-base text-black">Lead list</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/10 bg-black/[0.02]">
                  <th className="px-6 py-3 text-left font-medium text-black">Name</th>
                  <th className="px-6 py-3 text-left font-medium text-black">Contact</th>
                  <th className="px-6 py-3 text-left font-medium text-black">Treatment interest</th>
                  <th className="px-6 py-3 text-left font-medium text-black">Est. value</th>
                  <th className="px-6 py-3 text-left font-medium text-black">Status</th>
                  <th className="px-6 py-3 text-left font-medium text-black" title="Budget / Urgency / Conversion (1-5)">Intent (B/U/C)</th>
                  <th className="px-6 py-3 text-left font-medium text-black">Notes</th>
                  <th className="px-6 py-3 text-right font-medium text-black">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dummyLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-black/5 hover:bg-black/[0.02]">
                    <td className="px-6 py-4 font-medium text-black">{lead.name}</td>
                    <td className="px-6 py-4 text-black/70">
                      {lead.phone}
                      <br />
                      <span className="text-xs">{lead.email}</span>
                    </td>
                    <td className="px-6 py-4 text-black/80">{lead.serviceType}</td>
                    <td className="px-6 py-4 text-black/80">{lead.estimatedBudget}</td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                          statusStyles[lead.qualificationStatus]
                        )}
                      >
                        {lead.qualificationStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-black/80">
                      {[lead.budgetScore, lead.urgencyScore, lead.conversionScore].every((s) => s != null)
                        ? `${lead.budgetScore}/${lead.urgencyScore}/${lead.conversionScore}`
                        : lead.aiScore ?? "—"}
                    </td>
                    <td className="px-6 py-4 max-w-[140px] truncate text-black/70 text-xs" title={lead.insuranceInfo ?? undefined}>
                      {lead.insuranceInfo ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <CallBackButton phone={lead.phone} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
