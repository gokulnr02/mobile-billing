"use client";
import { useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const dummyData = [
    { name: "Jan", received: 8000, pending: 2000 },
    { name: "Feb", received: 9500, pending: 500 },
    { name: "Mar", received: 7800, pending: 2200 },
    { name: "Apr", received: 7000, pending: 3000 },
    { name: "May", received: 8600, pending: 1400 },
    { name: "Jun", received: 9200, pending: 800 },
];

export default function BarChartPopup() {
    const [filter, setFilter] = useState("This Year");
    const [showCustomRange, setShowCustomRange] = useState(false);
    const [customStart, setCustomStart] = useState(null);
    const [customEnd, setCustomEnd] = useState(null);

    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedYear, setSelectedYear] = useState("");

    const filterOptions = [
        "Today",
        "Last 7 Days",
        "Last Month",
        "This Year",
        "Select Year & Month",
        "Custom Range",
    ];

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const years = Array.from({ length: 5 }, (_, i) => 2025 - i);

    const handleFilterChange = (value) => {
        setFilter(value);
        setShowCustomRange(value === "Custom Range");
    };

    return (
        <div className="bg-white rounded-xl shadow-md px-4 py-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold"> Overview</h2>
                <select
                    className="text-sm border rounded px-2 py-1"
                    value={filter}
                    onChange={(e) => handleFilterChange(e.target.value)}
                >
                    {filterOptions.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
            </div>

            {/* Month/Year dropdown */}
            {filter === "Select Year & Month" && (
                <div className="flex gap-2 mb-4">
                    <select
                        className="border rounded px-2 py-1"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                        <option value="">Select Month</option>
                        {months.map((m) => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                    <select
                        className="border rounded px-2 py-1"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    >
                        <option value="">Select Year</option>
                        {years.map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Date Picker Popup for Custom Range */}
            {showCustomRange && (
                <div className="flex gap-4 items-center mb-4">
                    <div>
                        <p className="text-sm mb-1">From:</p>
                        <DatePicker
                            selected={customStart}
                            onChange={(date) => setCustomStart(date)}
                            selectsStart
                            startDate={customStart}
                            endDate={customEnd}
                            className="border px-2 py-1 rounded"
                            placeholderText="Start Date"
                        />
                    </div>
                    <div>
                        <p className="text-sm mb-1">To:</p>
                        <DatePicker
                            selected={customEnd}
                            onChange={(date) => setCustomEnd(date)}
                            selectsEnd
                            startDate={customStart}
                            endDate={customEnd}
                            minDate={customStart}
                            className="border px-2 py-1 rounded"
                            placeholderText="End Date"
                        />
                    </div>
                </div>
            )}

            {/* Chart */}
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dummyData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="received" fill="#34d399" name="Received" />
                        <Bar dataKey="pending" fill="#f87171" name="Pending" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
