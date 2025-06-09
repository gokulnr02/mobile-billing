"use client";

import {
  FilePlus,
  ListOrdered,
  Clock3,
  CheckCircle2,
  AlignJustify,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BarChartPopup from "./components/BarChartPopup";

const dummyData = [
  { name: "Jan", received: 8000, pending: 2000 },
  { name: "Feb", received: 9500, pending: 500 },
  { name: "Mar", received: 7800, pending: 2200 },
  { name: "Apr", received: 7000, pending: 3000 },
  { name: "May", received: 8600, pending: 1400 },
  { name: "Jun", received: 9200, pending: 800 },
];

const dummyBills = [
  { customer: "Gokul", date: "2025-06-01", amount: 10000 },
  { customer: "Ram", date: "2025-06-02", amount: 15000 },
  { customer: "Alex", date: "2025-06-03", amount: 20000 },
  { customer: "Sam", date: "2025-06-04", amount: 18000 },
  { customer: "John", date: "2025-06-05", amount: 12000 },
];

export default function Home() {
  const router = useRouter();
  const [filteredBills, setFilteredBills] = useState(dummyBills);
  const [filterType, setFilterType] = useState("All");

  const handleFilter = (type) => {
    setFilterType(type);

    // Dummy filtering logic - replace with real date filtering as needed
    if (type === "Today") {
      setFilteredBills(dummyBills.slice(0, 1));
    } else if (type === "Last 7 Days") {
      setFilteredBills(dummyBills.slice(0, 3));
    } else {
      setFilteredBills(dummyBills);
    }
  };

  const handleViewBill = (bill) => {
    alert(`View bill for ${bill.customer} — ₹${bill.amount}`);
  };

  const handleNewBill = () => {
    router.push("/BillRegistry");
  };

  const showTable = (tableName) => {
    if (tableName === "See all bills") {
      router.push("/BillRegistry");
    } else if (tableName === "See long pending bills") {
      alert("Showing long pending bills (dummy data)");
    }
  }

  return (
    <div className="min-h-screen bg-[#e5f2ff] font-sans">
      {/* Navbar */}
      <nav className="w-full h-14 bg-[#574f7d] shadow flex items-center px-6 text-white font-semibold text-lg justify-between">
        <AlignJustify size={30} />
        <div className="flex items-center gap-2 font-semibold">
          <p className="text-xl">SK Crane Services</p>
          <p className="w-10 h-10 rounded-full bg-white flex justify-center items-center text-black">
            SK
          </p>
        </div>
      </nav>

      {/* Banner */}
      <div
        className="w-full h-48 bg-cover bg-center flex justify-end items-end px-6 py-4"
        style={{ backgroundImage: "url('/assets/crane.jpg')" }}
      >
        <button
          onClick={handleNewBill}
          className="bg-[#6b8fb3] hover:bg-[#4b647d] text-white font-bold py-2 px-6 rounded shadow flex items-center gap-2"
        >
          <FilePlus size={18} />
          New Bill
        </button>
      </div>

      {/* Top Action Buttons */}
      <div className="w-full bg-white shadow overflow-x-auto">
        <div className="flex min-w-max justify-center md:justify-start">
          {[
            "Today",
            "Last 7 Days",
            "Last Month",
            "This Year",
            "Select Year & Month",
            "Custom Range",
          ].map((label, index) => (
            <button
              key={index}
              onClick={() => handleFilter(label)}
              className={`whitespace-nowrap px-4 py-2 text-sm font-medium shadow transition duration-200 ease-in-out ${filterType === label ? "bg-[#4b647d]" : "bg-[#6b8fb3]"
                } text-white hover:bg-[#4b647d]`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Summary Card */}
        <div className="w-full max-w-md p-6 rounded-2xl bg-gradient-to-br from-[#d0f0e0] via-[#e6f7ff] to-[#ffffff] text-gray-800 shadow">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-sm font-medium text-gray-500">
                Amount Received
              </h2>
              <p className="text-2xl font-semibold text-green-700">₹1,20,000</p>
            </div>
            <div className="text-right">
              <h2 className="text-sm font-medium text-gray-500">
                Amount Pending
              </h2>
              <p className="text-2xl font-semibold text-red-600">₹40,000</p>
            </div>
          </div>
          <div className="border-t border-dashed border-gray-300 pt-4 text-center">
            <h2 className="text-md font-medium text-gray-600">Total</h2>
            <p className="text-3xl font-bold text-gray-800">₹1,60,000</p>
          </div>
        </div>

        {/* Bar Chart */}
        <BarChartPopup data={dummyData} />

        {/* Recent Bills Table */}
        <div className="bg-white rounded-xl shadow-md px-4 py-4 w-full md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Recent Bills</h2>
          <div className="overflow-x-auto">
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
                {filteredBills.map((bill, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 border-t border-gray-100"
                  >
                    <td className="py-2 text-left">{bill.customer}</td>
                    <td className="py-2 text-center">{bill.date}</td>
                    <td className="py-2 text-center">
                      ₹{bill.amount.toLocaleString()}
                    </td>
                    <td className="py-2 text-center">
                      <button
                        onClick={() => handleViewBill(bill)}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
          <button
            onClick={() => showTable("See all bills")}
            className="flex items-center px-4 gap-2 bg-blue-400 hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow"
          >
            <ListOrdered size={24} />
            <span className="w-full text-left" >See All Bills</span>
          </button>
          <button
            onClick={() => showTable("See long pending bills")}
            className="flex items-center px-4 gap-2 bg-yellow-400 hover:bg-yellow-600 text-white font-medium py-3 rounded-lg shadow"
          >
            <Clock3 size={24} />
            <span className="w-full text-left">See Long Pending</span>
          </button>
          <button
            onClick={() => showTable("See completed payments")}
            className="flex items-center px-4 gap-2 bg-green-500 hover:bg-green-400 text-white font-medium py-3 rounded-lg shadow"
          >
            <CheckCircle2 size={24} />
            <span className="w-full text-left">Payment Completed</span>
          </button>
        </div>
      </div>
    </div>
  );
}
