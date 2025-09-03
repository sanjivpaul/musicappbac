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
    thumbnail: null, // ✅ must match backend
    pictures: null, // optional
  });
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();

  //     const formData = new FormData();
  //     Object.keys(form).forEach((key) => {
  //       formData.append(key, form[key]);
  //     });

  //     try {
  //       await axios.post("/api/artist/upload", formData, {
  //         headers: { "Content-Type": "multipart/form-data" },
  //       });
  //       navigate("/artists"); // redirect back to artist list
  //     } catch (error) {
  //       console.error("Error adding artist:", error);
  //     }
  //   };

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();

  //     const formData = new FormData();
  //     // formData.append("artist_name", form.artist_name);
  //     // formData.append("country_of_origin", form.country_of_origin);
  //     // formData.append("category", form.category);
  //     // if (form.thumbnail_path) {
  //     //   formData.append("thumbnail", form.thumbnail_path); // ✅ MUST match Multer config
  //     // }

  //     formData.append("artist_name", form.artist_name);
  //     formData.append("country_of_origin", form.country_of_origin);
  //     formData.append("category", form.category);
  //     if (form.thumbnail) {
  //       formData.append("thumbnail", form.thumbnail); // ✅ matches multer
  //     }
  //     if (form.pictures) {
  //       formData.append("pictures", form.pictures); // ✅ optional
  //     }

  //     console.log("formData=", formData);

  //     for (let pair of formData.entries()) {
  //       console.log(pair[0] + ":", pair[1]);
  //     }

  //     try {
  //       await axios.post("/api/artist/upload", formData, {
  //         headers: { "Content-Type": "multipart/form-data" },
  //       });
  //       navigate("/artist"); // redirect back
  //     } catch (error) {
  //       console.error("Error adding artist:", error);
  //     }
  //   };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("artist_name", form.artist_name);
    formData.append("country_of_origin", form.country_of_origin);
    formData.append("category", form.category);

    if (form.thumbnail) {
      formData.append("thumbnail", form.thumbnail); // ✅ MUST match multer fieldname
    }
    if (form.pictures) {
      formData.append("pictures", form.pictures);
    }

    // Debugging: log the FormData correctly
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      await axios.post("/api/artist/upload", formData, {
        withCredentials: false, // or true if cookies/session are used
      });

      setAlert({ type: "success", message: "Artist added successfully!" });
      setTimeout(() => navigate("/artist"), 1500);
    } catch (error) {
      //   console.error(
      //     "Error adding artist:",
      //     error.response?.data || error.message
      //   );
      setAlert({
        type: "error",
        message:
          error.response?.data?.message ||
          "Failed to add artist. Please try again.",
      });
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
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Save Artist
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
