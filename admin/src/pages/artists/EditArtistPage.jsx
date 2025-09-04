import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../home/DashboardLayout";
import AlertMessage from "../../components/alerts/AlertMessage";

export default function EditArtistPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    artist_name: "",
    country_of_origin: "",
    category: "",
    play_counter: "0",
    likes: "0",
    thumbnail: null,
    pictures: null,
  });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch artist details
  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await axios.get(`/api/artist/get/${id}`);
        const data = response.data.data;

        setForm({
          artist_name: data.artist_name || "",
          country_of_origin: data.country_of_origin || "",
          category: data.category || "",
          play_counter: data.play_counter || "0",
          likes: data.likes || "0",
          thumbnail: null, // reset file field
          pictures: null,
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
    formData.append("play_counter", form.play_counter);
    formData.append("likes", form.likes);

    if (form.thumbnail) formData.append("thumbnail", form.thumbnail);
    if (form.pictures) formData.append("pictures", form.pictures);

    try {
      setSaving(true);
      await axios.put(`/api/artist/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
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
    } finally {
      setSaving(false);
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
            type="number"
            name="play_counter"
            placeholder="Play Counter"
            value={form.play_counter}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            name="likes"
            placeholder="Likes"
            value={form.likes}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <div>
            <label className="block text-sm font-medium">
              Thumbnail (replace)
            </label>
            <input
              type="file"
              name="thumbnail"
              accept="image/*"
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Pictures (replace, optional)
            </label>
            <input
              type="file"
              name="pictures"
              accept="image/*"
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Updating..." : "Update Artist"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
