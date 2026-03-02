import { dummyAppointments } from "@/lib/dummy-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AppointmentsPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold text-black">Appointments</h1>
      <p className="mt-1 text-sm text-black/60">Booked consultations (dummy data)</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dummyAppointments.map((apt) => (
          <Card key={apt.id} className="border-black/10">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base text-black">
                <Calendar className="h-4 w-4 text-black/60" />
                {apt.leadName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-black/70">
              <p>{formatDateTime(apt.startTime)}</p>
              <p>{apt.serviceType}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
