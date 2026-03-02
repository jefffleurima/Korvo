"use client";

import { dummyAnalytics } from "@/lib/dummy-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AnalyticsPage() {
  const revenueFormatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(dummyAnalytics.revenueCaptured);
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold text-black">Analytics</h1>
      <p className="mt-1 text-sm text-black/60">Close rate, qualification, revenue (dummy data)</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Card className="border-black/10">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-black/70">Close rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-black">{dummyAnalytics.closeRate}%</div>
          </CardContent>
        </Card>
        <Card className="border-black/10">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-black/70">Qualification rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-black">{dummyAnalytics.qualificationRate}%</div>
          </CardContent>
        </Card>
        <Card className="border-black/10">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-black/70">Revenue captured</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-black">{revenueFormatted}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8 border-black/10">
        <CardHeader>
          <CardTitle className="text-lg text-black">Lead source breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dummyAnalytics.leadSourceBreakdown}
                layout="vertical"
                margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(0 0 0 / 0.08)" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="rgb(0 0 0 / 0.5)" />
                <YAxis type="category" dataKey="source" width={140} tick={{ fontSize: 12 }} stroke="rgb(0 0 0 / 0.5)" />
                <Tooltip
                  contentStyle={{ backgroundColor: "white", border: "1px solid rgb(0 0 0 / 0.1)", borderRadius: "8px" }}
                />
                <Bar dataKey="count" name="Leads" fill="black" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
