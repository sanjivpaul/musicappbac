import React from "react";
import UserTable from "../../components/tables/UserTable";
import DashboardLayout from "../home/DashboardLayout";

export default function UsersPage() {
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      active: true,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Editor",
      active: false,
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "Viewer",
      active: true,
    },
  ];

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
        <UserTable users={users} />
      </div>
    </DashboardLayout>
  );
}
