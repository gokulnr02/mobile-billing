"use client";
import { useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
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
    { name: "Jul", received: 8100, pending: 1900 },
    { name: "Aug", received: 8700, pending: 1300 },
    { name: "Sep", received: 7300, pending: 2700 },
    { name: "Oct", received: 9400, pending: 600 },
    { name: "Nov", received: 8900, pending: 1100 },
    { name: "Dec", received: 9700, pending: 300 },
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
        <div className="bg-white rounded-xl shadow-md px-4 py-4 pt-10">
       
            {/* Scrollable Chart */}
            <div className="h-64 overflow-x-auto">
                <div style={{ width: "100%", height: "100%" }}>
                    <BarChart width={dummyData.length * 50} height={250} data={dummyData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="received" fill="#6b8fb3" name="Received" />
                        <Bar dataKey="pending" fill="#4b647d" name="Pending" />
                    </BarChart>
                </div>
            </div>
        </div>
    );
}
