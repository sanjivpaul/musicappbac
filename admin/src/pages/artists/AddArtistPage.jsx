import React, { useState } from "react";
import DashboardLayout from "../home/DashboardLayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AlertMessage from "../../components/alerts/AlertMessage";

export default function AddArtistPage() {
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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
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
      setLoading(true);
      await axios.post("/api/artist/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAlert({ type: "success", message: "Artist added successfully!" });
      setTimeout(() => navigate("/artist"), 1500);
    } catch (error) {
      setAlert({
        type: "error",
        message:
          error.response?.data?.message ||
          "Failed to add artist. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Add Artist</h2>

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
            placeholder="Category (e.g. pop, rock)"
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
            <label className="block text-sm font-medium">Thumbnail *</label>
            <input
              type="file"
              name="thumbnail"
              accept="image/*"
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Pictures (Optional)
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
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Artist"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
