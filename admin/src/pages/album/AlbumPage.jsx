import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../home/DashboardLayout";
import AlbumTable from "../../components/tables/AlbumTable";

export default function AlbumsPage() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await axios.get("/api/album/get");
        if (res.status === 200) {
          setAlbums(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching albums:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  if (loading) return <p className="p-4">Loading albums...</p>;

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Albums</h2>
        <button
          onClick={() => navigate("/album/add")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          Add Album
        </button>
      </div>

      <AlbumTable
        data={albums}
        actions={(row) => (
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/album/edit/${row._id}`)}
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
