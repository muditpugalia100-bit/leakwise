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

interface BillChartProps {
  data: { month: string; amount: number }[];
  accent: "orange" | "neutral";
  height?: number;
}

const ACCENT: Record<BillChartProps["accent"], { stroke: string; fill: string }> = {
  orange: { stroke: "#D77A3A", fill: "#D77A3A" },
  neutral: { stroke: "#6B6259", fill: "#6B6259" },
};

export function BillChart({ data, accent, height = 180 }: BillChartProps) {
  const { stroke, fill } = ACCENT[accent];
  const gradientId = `grad-${accent}`;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={data}
        margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fill} stopOpacity={0.28} />
            <stop offset="100%" stopColor={fill} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="month"
          tick={{ fill: "#6B6259", fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          dy={8}
        />
        <YAxis
          tick={{ fill: "#6B6259", fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
          width={48}
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
          formatter={(v) => [formatINR(Number(v)), "Bill"]}
        />
        <Area
          type="monotone"
          dataKey="amount"
          stroke={stroke}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          activeDot={{ r: 5, strokeWidth: 0, fill: stroke }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
