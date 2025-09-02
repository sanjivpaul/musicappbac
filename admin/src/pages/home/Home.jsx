import React from "react";
import DashboardLayout from "./DashboardLayout";

export default function Home() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800">
        Welcome to the Dashboard
      </h1>
      <p className="mt-2 text-gray-600">
        Here’s where your admin stats will go.
      </p>
    </DashboardLayout>
  );
}
