"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const data = [
  { name: "Received", value: 80000 },
  { name: "Pending", value: 20000 },
];

const COLORS = ["#34d399", "#f87171"];

export default function PieChartCard() {
  return (
    <div className="bg-white rounded-xl shadow-md px-4 py-4">
      <h2 className="text-xl font-semibold mb-4">Total Billing Summary</h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={90}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
