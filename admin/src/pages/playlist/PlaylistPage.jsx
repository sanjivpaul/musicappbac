import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../home/DashboardLayout";
import DynamicTable from "../../components/tables/DynamicTable";
import { useNavigate } from "react-router-dom";
import PlaylistTable from "../../components/tables/PlaylistTable";

export default function PlaylistPage() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await axios.get("/api/playlist/get");
        if (res.status === 200) {
          setPlaylists(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching playlists:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  if (loading) return <p className="p-4">Loading playlists...</p>;

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Playlists</h2>
        <button
          onClick={() => navigate("/playlist/add")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          Add Playlist
        </button>
      </div>

      <PlaylistTable
        data={playlists}
        actions={(row) => (
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/playlist/edit/${row._id}`)}
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
