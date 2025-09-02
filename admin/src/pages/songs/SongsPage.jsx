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
      setLoading(true);

      try {
        const response = await axios.get("/api/song/get");
        // const json = await response.json();
        // console.log(response);

        if (response?.success) {
          // setSongs(json.data);
          setSongs(response?.data);
          setLoading(false);
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
