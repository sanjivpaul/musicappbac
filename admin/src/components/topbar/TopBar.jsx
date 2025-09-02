import React from "react";
import { Bell, User } from "lucide-react";
import { useSelector } from "react-redux";

export default function TopBar() {
  const user = useSelector((state) => state.auth.user);

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 bg-white shadow-md">
      {/* Left: Logo / Title */}
      {/* <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 truncate">
        Music Admin
      </div> */}
      <div className="ml-2 sm:ml-10 lg:ml-1 text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 truncate">
        Music Admin
      </div>

      {/* Right: Actions */}
      <div className="flex items-center justify-center space-x-2 sm:space-x-4 h-full">
        {/* Notification Bell */}
        <button className="relative p-1 sm:p-2 rounded-full hover:bg-gray-100 flex items-center justify-center">
          <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Info */}
        <button className="flex items-center justify-center space-x-1 sm:space-x-2">
          <User className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600" />
          {/* Hide username on very small screens */}
          <span className="hidden sm:inline text-xs sm:text-sm lg:text-base font-medium text-gray-700 truncate">
            {user?.user_name}
          </span>
        </button>
      </div>
    </header>
  );
}
