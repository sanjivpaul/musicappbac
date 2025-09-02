import React from "react";

export default function DynamicTable({ data = [], title = "Table", actions }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  // Extract headers from object keys
  const headers = Object.keys(data[0]);

  return (
    <div className="bg-white shadow rounded-lg p-6 overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <table className="min-w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            {headers.map((key) => (
              <th
                key={key}
                className="px-4 py-2 text-left font-medium text-gray-600 border-b"
              >
                {key.replace(/_/g, " ").toUpperCase()}
              </th>
            ))}
            {actions && (
              <th className="px-4 py-2 text-left font-medium text-gray-600 border-b">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              {headers.map((key) => (
                <td
                  key={key}
                  className="px-4 py-2 border-b text-gray-700 whitespace-nowrap"
                >
                  {row[key]}
                </td>
              ))}
              {actions && (
                <td className="px-4 py-2 border-b text-gray-700 whitespace-nowrap">
                  {actions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
