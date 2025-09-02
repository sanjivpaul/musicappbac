import React, { useEffect, useState } from "react";
import UserTable from "../../components/tables/UserTable";
import DashboardLayout from "../home/DashboardLayout";
import DynamicTable from "../../components/tables/DynamicTable";
import axios from "axios";

export default function UsersPage() {
  // const users = [
  //   {
  //     id: 1,
  //     name: "John Doe",
  //     email: "john@example.com",
  //     role: "Admin",
  //     active: true,
  //   },
  //   {
  //     id: 2,
  //     name: "Jane Smith",
  //     email: "jane@example.com",
  //     role: "Editor",
  //     active: false,
  //   },
  //   {
  //     id: 3,
  //     name: "Bob Johnson",
  //     email: "bob@example.com",
  //     role: "Viewer",
  //     active: true,
  //   },
  // ];

  const [users, setUsers] = useState([]);
  console.log(users);

  useEffect(() => {
    // Fetch songs from backend
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/user/");
        // const json = await response.json();
        // console.log(response);

        if (response.status == 200) {
          // setSongs(json.data);
          setUsers(response?.data?.data?.users);
        }
      } catch (error) {
        console.error("Error fetching songs:", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <DashboardLayout>
      {/* <div> */}
      {/* <h1 className="text-2xl font-bold mb-6">Manage Users</h1> */}
      {/* <UserTable users={users} /> */}
      <DynamicTable
        title="Users"
        data={users}
        actions={(row) => (
          <div className="flex gap-2">
            <button className="text-blue-600 hover:underline">Edit</button>
            <button className="text-red-600 hover:underline">Delete</button>
          </div>
        )}
      />
      {/* </div> */}
    </DashboardLayout>
  );
}
