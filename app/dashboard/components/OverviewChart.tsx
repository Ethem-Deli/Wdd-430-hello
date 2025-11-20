"use client";

import { LineChart, Line, Tooltip, XAxis, YAxis } from "recharts";

// Define the shape of one data item
type ChartPoint = {
  name: string;
  value: number;
};

// Define props for the component
interface OverviewChartProps {
  data: ChartPoint[];
}

export default function OverviewChart({ data }: OverviewChartProps) {
  return (
    <LineChart width={500} height={300} data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="value" />
    </LineChart>
  );
}
