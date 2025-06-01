"use client";

import {
  FilePlus,
  ListOrdered,
  Clock3,
  CheckCircle2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useState } from "react";
import PieChartCard from "./components/PieChartCard";
import BarChartPopup from "./components/BarChartPopup";

const dummyData = [
  { name: "Jan", received: 8000, pending: 2000 },
  { name: "Feb", received: 9500, pending: 500 },
  { name: "Mar", received: 7800, pending: 2200 },
  { name: "Apr", received: 7000, pending: 3000 },
  { name: "May", received: 8600, pending: 1400 },
  { name: "Jun", received: 9200, pending: 800 },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Navbar */}
      <nav className="w-full h-14 bg-teal-500 shadow flex items-center px-6 text-white font-semibold text-lg">
        Billing Dashboard
      </nav>

      {/* Header Area */}
      <div
        className="w-full h-48 bg-cover bg-center flex justify-end items-end px-6 py-4"
        style={{ backgroundImage: "url('/assets/crane.jpg')" }}
      >
        <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded shadow flex items-center gap-2">
          <FilePlus size={18} />
          New Bill
        </button>
      </div>

      {/* Main Content */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pie Chart Card */}
        <PieChartCard />

        {/* Bar Chart Section with Popup */}
        <BarChartPopup data={dummyData} />

        {/* Recent Bills Table */}
        <div className="bg-white rounded-xl shadow-md px-4 py-4 w-full">
          <h2 className="text-xl font-semibold mb-4">Recent Bills</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-200 text-gray-700 text-left">
                <th className="py-2 text-center">Customer</th>
                <th className="py-2 text-center">Date</th>
                <th className="py-2 text-center">Amount</th>
                <th className="py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {["Gokul", "Gokul", "Gokul", "Gokul", "Gokul"].map((name, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 border-t border-gray-100 text-sm"
                >
                  <td className="py-2 text-left">{name}</td>
                  <td className="py-2 text-center">01-06-2025</td>
                  <td className="py-2 text-center">10000</td>
                  <td className="py-2 text-center">
                    <button className="text-blue-600 hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Buttons */}
        <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
          <button className="flex items-center px-4 gap-2 bg-blue-400 hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow">
            <ListOrdered size={24} className="w-[30px]" />
            <p className="w-full text-left"> See All Bills</p>
          </button>
          <button className="flex items-center px-4 gap-2 bg-yellow-400 hover:bg-yellow-600 text-white font-medium py-3 rounded-lg shadow">
            <Clock3 size={24} className="w-[30px]" />
            <p className="w-full text-left"> See Long Pending </p>
          </button>
          <button className="flex items-center px-4 gap-2 bg-green-500 hover:bg-green-400 text-white font-medium py-3 rounded-lg shadow">
            <CheckCircle2 size={24} className="w-[30px]" />
            <p className="w-full text-left"> Payment Completed </p>
          </button>
        </div>
      </div>
    </div>
  );
}
