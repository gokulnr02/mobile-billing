"use client";

import {
  FilePlus,
  ListOrdered,
  Clock3,
  CheckCircle2,
  AlignJustify,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BarChartPopup from "./components/BarChartPopup";


export default function Home() {
  const router = useRouter();
  const [filteredBills, setFilteredBills] = useState([]);
  const [filterType, setFilterType] = useState("Today");
  const [cardDetails, setCardDetails] = useState([]);
  const [chartData, setChartDate] = useState([]);
  const handleFilter = async (json) => {
    const response = await Apifetch(
      "/api/BillRegistry/select",
      { type: "last5transactions", ...json },
      "POST"
    );
    if (response && Array.isArray(response)) {
      setFilteredBills(response);
    }
  };

  const handleViewBill = (bill) => {
    alert(`View bill for ${bill.customer} — ₹${bill.amount}`);
  };

  const handleChartData = async (json) => {
    const response = await Apifetch(
      "/api/BillRegistry/select",
      { type: "chartData", ...json },
      "POST"
    );
    
    if (response && Array.isArray(response)) {
      setChartDate(response)
    }
  }

  const handleNewBill = () => {
    router.push("/BillRegistry/Entry");
  };

  const showTable = (tableName) => {
    switch (tableName) {
      case "See all bills":
        router.push("/BillRegistry/Table");
        break;
      case "See long pending bills":
        alert("Showing long pending bills (dummy data)");
        break;
      case "See completed payments":
        alert("Showing completed payments (dummy data)");
        break;
    }
  };

  const Apifetch = async (api, json, method) => {
    try {
      const response = await fetch(api, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json),
      });

      if (!response.ok) throw new Error("Failed to fetch data");
      return await response.json();
    } catch (error) {
      console.error("API fetch error:", error);
      return [];
    }
  };

  const fetchCardDetails = async (json) => {
    const res = await Apifetch(
      "/api/BillRegistry/select",
      { type: "carddetails", ...json },
      "POST"
    );
    if (res?.length > 0) {
      setCardDetails(res);
    }
  };

  const getDateRange = async (type) => {
    let fromDate, toDate;
    const now = new Date();

    switch (type) {
      case "Today":
        fromDate = toDate = now;
        break;
      case "Last 7 Days":
        fromDate = new Date();
        fromDate.setDate(now.getDate() - 7);
        toDate = now;
        break;
      case "Last Month":
        fromDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        toDate = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case "This Year":
        fromDate = new Date(now.getFullYear(), 0, 1);
        toDate = new Date(now.getFullYear(), 11, 31);
        break;
      case "Select Year & Month":
        fromDate = new Date(2025, 0, 1);
        toDate = new Date(2025, 11, 31);
        break;
      default:
        fromDate = toDate = now;
    }

    return {
      fromDate: fromDate.toISOString().split("T")[0],
      toDate: toDate.toISOString().split("T")[0],
      DateType: type,
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      const dateRange = await getDateRange(filterType);
      fetchCardDetails(dateRange);
      handleFilter(dateRange);
      handleChartData(dateRange);
    };

    fetchData();
  }, [filterType]);

  return (
    <div className="min-h-screen bg-[#e5f2ff] font-sans">
      {/* Navbar */}
      <nav className="w-full h-14 bg-[#574f7d] shadow flex items-center px-6 text-white font-semibold text-lg justify-between">
        <AlignJustify size={30} />
        <div className="flex items-center gap-2 font-semibold">
          <p className="text-xl">SK Crane Services</p>
          <p className="w-10 h-10 rounded-full bg-white flex justify-center items-center text-black">SK</p>
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

      {/* Filter Buttons */}
      <div className="w-full bg-white shadow overflow-x-auto">
        <div className="flex w-full justify-center md:justify-start">
          {[
            "Today",
            "Last 7 Days",
            "Last Month",
            "This Year",
            "Select Year & Month",
            "Custom Range",
          ].map((label) => (
            <button
              key={label}
              onClick={() => setFilterType(label)}
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
        <div className="w-full p-6 rounded-2xl bg-gradient-to-br from-[#d0f0e0] via-[#e6f7ff] to-[#ffffff] text-gray-800 shadow">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-sm font-medium text-gray-500">Amount Received</h2>
              <p className="text-2xl font-semibold text-green-700">₹{cardDetails?.[0]?.AmountReceived || 0}</p>
            </div>
            <div className="text-right">
              <h2 className="text-sm font-medium text-gray-500">Amount Pending</h2>
              <p className="text-2xl font-semibold text-red-600">₹{cardDetails?.[0]?.AmountPending || 0}</p>
            </div>
          </div>
          <div className="border-t border-dashed border-gray-300 pt-4 text-center">
            <h2 className="text-md font-medium text-gray-600">Total</h2>
            <p className="text-3xl font-bold text-gray-800">₹{cardDetails?.[0]?.TotalAmount || 0}</p>
          </div>
        </div>

        {/* Bar Chart */}
        <BarChartPopup chartData={chartData} />

        {/* Recent Bills */}
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
                    <td className="py-2 text-left px-4">{bill.CustomerName}</td>
                    <td className="py-2 text-center">{bill.BillDate}</td>
                    <td className="py-2 text-center">₹{bill.BillAmount}</td>
                    <td className="py-2 text-center">
                      <button
                        onClick={() => handleViewBill(bill.Attachments)}
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
            <span className="w-full text-left">See All Bills</span>
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
