"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type SeriesPoint = {
  date: string;
  totalRon: number;
  profitRon: number;
};

export function StatsChart({ series }: { series: SeriesPoint[] }) {
  if (series.length === 0) {
    return <p className="text-sm text-[var(--muted)]">Nu există date suficiente.</p>;
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <LineChart data={series}>
          <CartesianGrid strokeDasharray="4 4" stroke="#2a3a43" />
          <XAxis dataKey="date" stroke="#9aa9a2" />
          <YAxis stroke="#9aa9a2" />
          <Tooltip
            contentStyle={{
              background: "#16222b",
              border: "1px solid #2a3a43",
              color: "#f3efe7",
            }}
          />
          <Line type="monotone" dataKey="totalRon" stroke="#fbbf24" strokeWidth={2} />
          <Line type="monotone" dataKey="profitRon" stroke="#34d399" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
