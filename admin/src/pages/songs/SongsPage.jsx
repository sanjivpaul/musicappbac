import React, { useEffect, useState } from "react";
import DashboardLayout from "../home/DashboardLayout";
import DynamicTable from "../../components/tables/DynamicTable";

export default function SongsPage() {
  const [songs, setSongs] = useState([]);
  console.log("songs=", songs);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch songs from backend
    const fetchSongs = async () => {
      try {
        const response = await fetch("http://192.168.1.6:3001/song/get");
        const json = await response.json();

        if (json.success) {
          setSongs(json.data);
        }
      } catch (error) {
        console.error("Error fetching songs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  if (loading) {
    return <p className="p-4">Loading songs...</p>;
  }

  return (
    <DashboardLayout>
      <DynamicTable
        title="Songs"
        data={songs}
        actions={(row) => (
          <div className="flex gap-2">
            <button className="text-blue-600 hover:underline">Edit</button>
            <button className="text-red-600 hover:underline">Delete</button>
          </div>
        )}
      />
    </DashboardLayout>
  );
}
