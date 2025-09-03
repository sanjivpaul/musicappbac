import React from "react";
import DashboardLayout from "../home/DashboardLayout";
import DynamicTable from "../../components/tables/DynamicTable";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ArtistPage() {
  const navigate = useNavigate();
  const [artists, setArtists] = useState([]);
  console.log("artists=", artists);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch songs from backend
    const fetchArtists = async () => {
      setLoading(true);

      try {
        const response = await axios.get("/api/artist/get");
        // const json = await response.json();
        // console.log(response);

        if (response?.status == 200) {
          setArtists(response?.data?.data);

          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching Artists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  if (loading) {
    return <p className="p-4">Loading artists...</p>;
  }
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Artists</h2>
        <button
          onClick={() => navigate("/artist/add")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          Add Artist
        </button>
      </div>
      <DynamicTable
        title="Artists"
        data={artists}
        actions={(row) => (
          <div className="flex gap-2">
            {/* <button className="text-blue-600 hover:underline">Edit</button> */}
            <button
              onClick={() => navigate(`/artist/edit/${row._id}`)} // 👈 navigate with artist id
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
