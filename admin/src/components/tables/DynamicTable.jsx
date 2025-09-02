// import React from "react";

// export default function DynamicTable({ data = [], title = "Table", actions }) {
//   if (!data || data.length === 0) {
//     return (
//       <div className="bg-white shadow rounded-lg p-6">
//         <h2 className="text-lg font-semibold mb-4">{title}</h2>
//         <p className="text-gray-500">No data available</p>
//       </div>
//     );
//   }

//   // Extract headers from object keys
//   const headers = Object.keys(data[0]);

//   return (
//     <div className="bg-white shadow rounded-lg p-6 overflow-x-auto">
//       <h2 className="text-lg font-semibold mb-4">{title}</h2>
//       <table className="min-w-full border border-gray-200 text-sm">
//         <thead className="bg-gray-100">
//           <tr>
//             {headers.map((key) => (
//               <th
//                 key={key}
//                 className="px-4 py-2 text-left font-medium text-gray-600 border-b"
//               >
//                 {key.replace(/_/g, " ").toUpperCase()}
//               </th>
//             ))}
//             {actions && (
//               <th className="px-4 py-2 text-left font-medium text-gray-600 border-b">
//                 Actions
//               </th>
//             )}
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((row, rowIndex) => (
//             <tr
//               key={rowIndex}
//               className="hover:bg-gray-50 transition-colors duration-150"
//             >
//               {headers.map((key) => (
//                 <td
//                   key={key}
//                   className="px-4 py-2 border-b text-gray-700 whitespace-nowrap"
//                 >
//                   {row[key]}
//                 </td>
//               ))}
//               {actions && (
//                 <td className="px-4 py-2 border-b text-gray-700 whitespace-nowrap">
//                   {actions(row)}
//                 </td>
//               )}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

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

  const headers = Object.keys(data[0]);

  return (
    <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <table className="min-w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            {headers.map((key, index) => {
              // Example: show first 3 columns always, rest only on md/lg screens
              let classes =
                "px-4 py-2 text-left font-medium text-gray-600 border-b";
              if (index > 2) classes += " hidden md:table-cell"; // hidden on small screens
              return (
                <th key={key} className={classes}>
                  {key.replace(/_/g, " ").toUpperCase()}
                </th>
              );
            })}
            {actions && (
              <th className="px-4 py-2 text-left font-medium text-gray-600 border-b hidden md:table-cell">
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
              {headers.map((key, index) => {
                let classes =
                  "px-4 py-2 border-b text-gray-700 whitespace-nowrap";
                if (index > 2) classes += " hidden md:table-cell";
                return (
                  <td key={key} className={classes}>
                    {row[key]}
                  </td>
                );
              })}
              {actions && (
                <td className="px-4 py-2 border-b text-gray-700 whitespace-nowrap hidden md:table-cell">
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
