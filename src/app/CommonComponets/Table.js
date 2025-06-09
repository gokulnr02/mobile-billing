"use client";
import { useState } from "react";
import View from "./View";

const dummyData = [
  {
    BillId: 1,
    BillNo: "BILL001",
    BillDate: "2025-06-01",
    CustomerName: "John Doe",
    CustomerContact: "9876543210",
    CustomerAddress: "123 Main Street",
    BillDescription: "Payment for services rendered",
    BillAmount: 1500,
    Attachments: "invoice.pdf", // Assume stored in /uploads/
    PaymentStatus: "Paid"
  },
  {
    BillId: 2,
    BillNo: "BILL002",
    BillDate: "2025-06-02",
    CustomerName: "Jane Smith",
    CustomerContact: "8765432109",
    CustomerAddress: "456 Market Road",
    BillDescription: "Consultation charges",
    BillAmount: 2000,
    Attachments: "receipt.pdf",
    PaymentStatus: "Pending"
  }
];

export default function Table() {
  const [data, setData] = useState(dummyData);
  const [editingId, setEditingId] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  const [viewData, setViewData] = useState(null);

  const fields = Object.keys(dummyData[0]);

  const startEdit = (id) => {
    const row = data.find((r) => r.BillId === id);
    setEditedRow({ ...row });
    setEditingId(id);
  };

  const saveEdit = () => {
    const updated = data.map((row) =>
      row.BillId === editingId ? editedRow : row
    );
    setData(updated);
    setEditingId(null);
    setEditedRow({});
  };

  if (viewData) {
    return <View data={viewData} onClose={() => setViewData(null)} />;
  }

  return (
    <div className="mt-6 overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            {fields.map((field) => (
              <th key={field} className="px-4 py-2 text-left font-semibold text-gray-700">
                {field}
              </th>
            ))}
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={row.BillId} className="hover:bg-gray-50">
              {fields.map((field) => (
                <td key={field} className="px-4 py-2">
                  {editingId === row.BillId && field !== "BillId" ? (
                    field === "PaymentStatus" ? (
                      <select
                        value={editedRow[field]}
                        onChange={(e) =>
                          setEditedRow({ ...editedRow, [field]: e.target.value })
                        }
                        className="border rounded px-2 py-1"
                      >
                        <option>Paid</option>
                        <option>Pending</option>
                      </select>
                    ) : field === "Attachments" ? (
                      row[field]
                    ) : (
                      <input
                        className="border px-2 py-1 rounded"
                        value={editedRow[field]}
                        onChange={(e) =>
                          setEditedRow({ ...editedRow, [field]: e.target.value })
                        }
                      />
                    )
                  ) : field === "Attachments" ? (
                    <a
                      href={`/uploads/${row[field]}`}
                      download
                      className="text-blue-600 underline"
                    >
                      {row[field]}
                    </a>
                  ) : (
                    row[field]
                  )}
                </td>
              ))}
              <td className="px-4 py-2 space-x-2">
                {editingId === row.BillId ? (
                  <button
                    onClick={saveEdit}
                    className="text-green-600 hover:underline"
                  >
                    Save
                  </button>
                ) : (
                  <>
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => startEdit(row.BillId)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-purple-600 hover:underline"
                      onClick={() => setViewData(row)}
                    >
                      View
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
