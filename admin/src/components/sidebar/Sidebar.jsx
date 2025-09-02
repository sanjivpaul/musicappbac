// import React from "react";
// import { Home, Users, Settings, LogOut } from "lucide-react";
// import { Link } from "react-router-dom";

// export default function Sidebar() {
//   return (
//     <aside className="h-screen w-64 bg-gray-800 text-white flex flex-col">
//       {/* Logo */}
//       <div className="flex items-center justify-center h-16 border-b border-gray-700">
//         <h1 className="text-lg font-bold">Music</h1>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 px-4 py-6 space-y-2">
//         <Link
//           to="/dashboard"
//           className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-700"
//         >
//           <Home className="w-5 h-5 mr-2" /> Dashboard
//         </Link>
//         <Link
//           to="/users"
//           className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-700"
//         >
//           <Users className="w-5 h-5 mr-2" /> Users
//         </Link>
//         <Link
//           to="/settings"
//           className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-700"
//         >
//           <Settings className="w-5 h-5 mr-2" /> Settings
//         </Link>
//       </nav>

//       {/* Footer */}
//       <div className="p-4 border-t border-gray-700">
//         <button className="flex items-center w-full px-3 py-2 rounded-lg hover:bg-gray-700">
//           <LogOut className="w-5 h-5 mr-2" /> Logout
//         </button>
//       </div>
//     </aside>
//   );
// }

import React, { useState } from "react";
import { Home, Users, Settings, LogOut, Menu } from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`h-screen bg-gray-800 text-white flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 border-b border-gray-700 px-4">
        {!collapsed && <h1 className="text-lg font-bold">My Admin</h1>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded hover:bg-gray-700"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-6 space-y-2">
        <Link
          to="/home"
          className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-700"
        >
          <Home className="w-5 h-5" />
          {!collapsed && <span className="ml-3">Dashboard</span>}
        </Link>
        <Link
          to="/users"
          className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-700"
        >
          <Users className="w-5 h-5" />
          {!collapsed && <span className="ml-3">Users</span>}
        </Link>
        <Link
          to="/songs"
          className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-700"
        >
          <Users className="w-5 h-5" />
          {!collapsed && <span className="ml-3">Songs</span>}
        </Link>
        <Link
          to="/settings"
          className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-700"
        >
          <Settings className="w-5 h-5" />
          {!collapsed && <span className="ml-3">Settings</span>}
        </Link>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <button className="flex items-center w-full px-3 py-2 rounded-lg hover:bg-gray-700">
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
