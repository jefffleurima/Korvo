import { dummyOverview, dummyPipelineData } from "@/lib/dummy-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CalendarCheck, PhoneOff, DollarSign } from "lucide-react";
import { PipelineChart } from "@/components/dashboard/PipelineChart";

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
}) {
  return (
    <Card className="border-black/10">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-black/70">{title}</CardTitle>
        <Icon className="h-4 w-4 text-black/50" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold text-black">{value}</div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const revenueFormatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(dummyOverview.revenueInfluenced);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold text-black">Revenue pipeline</h1>
      <p className="mt-1 text-sm text-black/60">Capture, score, and route. Pipeline and revenue at a glance.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Leads this month" value={dummyOverview.leadsThisMonth} icon={Users} />
        <StatCard title="Booked consultations" value={dummyOverview.bookedConsultations} icon={CalendarCheck} />
        <StatCard title="Missed calls recovered" value={dummyOverview.missedCallsRecovered} icon={PhoneOff} />
        <StatCard title="Revenue influenced" value={revenueFormatted} icon={DollarSign} />
      </div>

      <Card className="mt-8 border-black/10">
        <CardHeader>
          <CardTitle className="text-lg text-black">Lead flow (this week)</CardTitle>
          <CardDescription className="text-black/60">Inbound leads vs booked consultations</CardDescription>
        </CardHeader>
        <CardContent>
          <PipelineChart data={dummyPipelineData} />
        </CardContent>
      </Card>
    </main>
  );
}
