"use client";

import { useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function BarChartPopup(props) {
    const { chartData = [] } = props;

    // Estimate width based on data count (optional fallback)
    const chartWidth = Math.max(chartData.length * 80, 500); // 80px per bar

    return (
        <div className="bg-white rounded-xl shadow-md px-4 py-4 pt-10">
            {chartData.length > 0 ? (
                <div className="h-64 overflow-x-auto">
                    <div style={{ width: chartWidth, height: "100%" }}>
                        <BarChart width={chartWidth} height={250} data={chartData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="AmountPending" fill="#6b8fb3" name="Pending" />
                            <Bar dataKey="AmountReceived" fill="#4b647d" name="Received" />
                        </BarChart>
                    </div>
                </div>
            ) : (
                <p className="text-center text-gray-500">No data available</p>
            )}
        </div>
    );
}
