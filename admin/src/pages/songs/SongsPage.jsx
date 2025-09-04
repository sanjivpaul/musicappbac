import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../home/DashboardLayout";
import SongTable from "../../components/tables/SongTable";
import { useNavigate } from "react-router-dom";

export default function SongsPage() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await axios.get("/api/song/get");
        if (res.status === 200) {
          setSongs(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching songs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  if (loading) return <p className="p-4">Loading songs...</p>;

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Songs</h2>
        <button
          onClick={() => navigate("/song/add")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          Add Song
        </button>
      </div>

      <SongTable
        data={songs}
        actions={(row) => (
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/song/edit/${row._id}`)}
              className="text-blue-600 hover:underline"
            >
              Edit
            </button>
            <button className="text-red-600 hover:underline">Delete</button>
          </div>
        )}
      />
    </DashboardLayout>
  );
}
