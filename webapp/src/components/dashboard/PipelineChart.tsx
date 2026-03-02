"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type PipelineChartProps = {
  data: { name: string; leads: number; booked: number }[];
};

export function PipelineChart({ data }: PipelineChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgb(0 0 0 / 0.08)" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="rgb(0 0 0 / 0.5)" />
          <YAxis tick={{ fontSize: 12 }} stroke="rgb(0 0 0 / 0.5)" />
          <Tooltip
            contentStyle={{ backgroundColor: "white", border: "1px solid rgb(0 0 0 / 0.1)", borderRadius: "8px" }}
            labelStyle={{ color: "black" }}
          />
          <Legend />
          <Bar dataKey="leads" name="Leads" fill="rgb(0 0 0 / 0.25)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="booked" name="Booked" fill="black" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
