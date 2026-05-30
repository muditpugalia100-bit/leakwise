"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatINR } from "@/lib/format";
import type { PriceHistoryPoint } from "@/lib/engine/types";

export function PriceHistoryChart({
  data,
  accent,
}: {
  data: PriceHistoryPoint[];
  accent: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`spark-${accent.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity={0.28} />
            <stop offset="100%" stopColor={accent} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          tick={{ fill: "#6B6259", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(d) =>
            new Date(d).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            })
          }
          interval="preserveStartEnd"
          minTickGap={50}
          dy={6}
        />
        <YAxis
          tick={{ fill: "#6B6259", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) =>
            v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`
          }
          width={44}
          domain={["dataMin - 50", "dataMax + 50"]}
        />
        <Tooltip
          cursor={{ stroke: "#E8E1D4", strokeWidth: 1 }}
          contentStyle={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E8E1D4",
            borderRadius: 12,
            padding: "8px 12px",
            fontSize: 13,
            color: "#1F1B16",
            boxShadow: "0 8px 30px rgb(0 0 0 / 0.06)",
          }}
          labelStyle={{ color: "#6B6259", marginBottom: 2 }}
          formatter={(v) => [formatINR(Number(v)), "Listed price"]}
          labelFormatter={(d) =>
            new Date(d).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          }
        />
        <Area
          type="monotone"
          dataKey="price"
          stroke={accent}
          strokeWidth={2}
          fill={`url(#spark-${accent.slice(1)})`}
          activeDot={{ r: 4, strokeWidth: 0, fill: accent }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
