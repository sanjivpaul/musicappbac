import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../home/DashboardLayout";
import AlertMessage from "../../components/alerts/AlertMessage";

export default function EditArtistPage() {
  const { id } = useParams(); // get artist id from URL
  //   console.log("id=", id);

  const navigate = useNavigate();
  const [form, setForm] = useState({
    artist_name: "",
    country_of_origin: "",
    category: "",
    thumbnail: null,
  });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch artist details by id
  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await axios.get(`/api/artist/get/${id}`);
        const data = response.data.data;
        setForm({
          artist_name: data.artist_name,
          country_of_origin: data.country_of_origin,
          category: data.category,
          thumbnail: null, // keep null unless uploading a new file
        });
      } catch (error) {
        setAlert({ type: "error", message: "Failed to load artist details." });
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("artist_name", form.artist_name);
    formData.append("country_of_origin", form.country_of_origin);
    formData.append("category", form.category);
    if (form.thumbnail) formData.append("thumbnail", form.thumbnail);

    // Debugging: log the FormData correctly
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      await axios.put(`/api/artist/update/${id}`, formData, {
        // headers: { "Content-Type": "multipart/form-data" },
      });

      setAlert({ type: "success", message: "Artist updated successfully!" });
      setTimeout(() => navigate("/artist"), 1500);
    } catch (error) {
      setAlert({
        type: "error",
        message:
          error.response?.data?.message ||
          "Failed to update artist. Try again.",
      });
    }
  };

  if (loading) {
    return <p className="p-4">Loading artist details...</p>;
  }

  return (
    <DashboardLayout>
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-bold">Edit Artist</h2>

        {alert && (
          <AlertMessage
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="artist_name"
            placeholder="Artist Name"
            value={form.artist_name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="country_of_origin"
            placeholder="Country of Origin"
            value={form.country_of_origin}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="file"
            name="thumbnail"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Update Artist
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
