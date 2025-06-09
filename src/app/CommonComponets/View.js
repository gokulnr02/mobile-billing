"use client";
import React from "react";

export default function View({ data, onClose }) {
  const isImage = (filename) =>
    /\.(jpg|jpeg|png|gif)$/i.test(filename);

  const isPDF = (filename) => /\.pdf$/i.test(filename);

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Bill Details</h2>
      <div className="space-y-3">
        {Object.entries(data).map(([key, value]) => (
          <div key={key}>
            <strong>{key}:</strong>{" "}
            {key === "Attachments" ? (
              <div className="mt-2">
                {isImage(value) ? (
                  <img
                    src={`/uploads/${value}`}
                    alt={value}
                    className="max-w-xs rounded shadow"
                  />
                ) : isPDF(value) ? (
                  <iframe
                    src={`/uploads/${value}`}
                    title="PDF Preview"
                    className="w-full h-96 border rounded"
                  ></iframe>
                ) : (
                  <p>{value}</p>
                )}
                <a
                  href={`/uploads/${value}`}
                  download
                  className="mt-2 inline-block text-blue-600 underline"
                >
                  Download Attachment
                </a>
              </div>
            ) : (
              <span>{String(value)}</span>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={onClose}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Back
      </button>
    </div>
  );
}
