import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../home/DashboardLayout";
import { get } from "mongoose";
import { useEffect } from "react";
import SelectDropdown from "../../components/selectdropdown/SelectDropdown";

export default function AddSongPage() {
  const [form, setForm] = useState({
    song_name: "",
    language: "",
    bitrate: "",
    artist_id: "",
    album_id: "",
    likes: "",
    play_counter: "",
  });
  const [songFile, setSongFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [artistData, setArtistData] = useState([]);
  //   console.log("artistData===>", artistData);

  const [albumData, setAlbumData] = useState([]);
  //   console.log("albumData===>", albumData);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "song") setSongFile(files[0]);
    if (name === "thumbnail") setThumbnailFile(files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!songFile || !thumbnailFile) {
      alert("Please upload both song and thumbnail");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("song", songFile);
    formData.append("thumbnail", thumbnailFile);

    try {
      setLoading(true);
      const res = await axios.post("/api/song/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 201) {
        alert("Song added successfully!");
        navigate("/songs");
      }
    } catch (err) {
      console.error("Error adding song:", err);
      alert(err.response?.data?.message || "Failed to add song");
    } finally {
      setLoading(false);
    }
  };

  const getArtists = async () => {
    try {
      const res = await axios.get("/api/artist/get");
      if (res.status === 200) {
        setArtistData(res.data.data);
      }
    } catch (error) {
      console.log("Error fetching artists", error);
    }
  };

  const getAlbums = async () => {
    try {
      const res = await axios.get("/api/album/get");
      if (res.status === 200) {
        setAlbumData(res.data.data);
      }
    } catch (error) {
      console.log("Error fetching albums", error);
    }
  };

  useEffect(() => {
    getArtists();
    getAlbums();
  }, []);

  return (
    <DashboardLayout>
      <h2 className="text-xl font-bold mb-4">Add Song</h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-lg"
        encType="multipart/form-data"
      >
        <input
          type="text"
          name="song_name"
          placeholder="Song Name"
          value={form.song_name}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="language"
          placeholder="Language"
          value={form.language}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="bitrate"
          placeholder="Bitrate"
          value={form.bitrate}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        {/* <input
          type="text"
          name="artist_id"
          placeholder="Artist ID"
          value={form.artist_id}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        /> */}
        {/* Artist Dropdown */}
        <SelectDropdown
          data={artistData}
          labelKey="artist_name"
          valueKey="_id"
          placeholder="Select Artist"
          onChange={(val) => setForm({ ...form, artist_id: val })}
        />

        {/* Album Dropdown */}
        <SelectDropdown
          data={albumData}
          labelKey="album_name"
          valueKey="_id"
          placeholder="Select Album"
          onChange={(val) => setForm({ ...form, album_id: val })}
        />
        {/* <input
          type="text"
          name="album_id"
          placeholder="Album ID"
          value={form.album_id}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        /> */}
        <input
          type="number"
          name="likes"
          placeholder="Likes"
          value={form.likes}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="play_counter"
          placeholder="Play Counter"
          value={form.play_counter}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {/* File Uploads */}
        <label className="block">
          <span className="text-sm">Upload Song File</span>
          <input
            type="file"
            name="song"
            accept="audio/*"
            onChange={handleFileChange}
            required
            className="block mt-1"
          />
        </label>

        <label className="block">
          <span className="text-sm">Upload Thumbnail</span>
          <input
            type="file"
            name="thumbnail"
            accept="image/*"
            onChange={handleFileChange}
            required
            className="block mt-1"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Song"}
        </button>
      </form>
    </DashboardLayout>
  );
}
