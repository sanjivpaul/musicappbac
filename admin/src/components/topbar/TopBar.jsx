import React from "react";
import { Bell, User } from "lucide-react"; // Optional icons, needs lucide-react (npm i lucide-react)

export default function TopBar() {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white shadow-md">
      {/* Left: Logo / Title */}
      <div className="text-xl font-bold text-gray-800">Music Admin</div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="flex items-center space-x-2">
          <User className="w-6 h-6 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Admin</span>
        </button>
      </div>
    </header>
  );
}
