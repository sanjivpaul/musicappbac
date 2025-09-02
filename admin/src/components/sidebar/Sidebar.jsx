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
import { Home, Users, Settings, LogOut, Menu, Music } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/AuthSlice";

export default function Sidebar() {
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false); // for desktop collapse
  const [mobileOpen, setMobileOpen] = useState(false); // for mobile toggle

  const handleLogout = () => {
    dispatch(logout());
  };

  // Sidebar content (reusable)
  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between h-16 border-b border-gray-700 px-4">
        {!collapsed && <h1 className="text-lg font-bold">My Admin</h1>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded hover:bg-gray-700 hidden lg:block"
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
          <Music className="w-5 h-5" />
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
        <button
          className="flex items-center w-full px-3 py-2 rounded-lg hover:bg-gray-700"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        className="lg:hidden fixed top-2 left-4 z-50 p-2 bg-gray-800 text-white rounded-md mb-2 sm:mb-10"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col transition-all duration-300 h-screen bg-gray-800 text-white ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setMobileOpen(false)}
          ></div>
          <aside className="relative flex-1 flex flex-col w-64 bg-gray-800 text-white">
            <button
              className="absolute top-2 right-4 p-2 rounded hover:bg-gray-700"
              onClick={() => setMobileOpen(false)}
            >
              ✕
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
