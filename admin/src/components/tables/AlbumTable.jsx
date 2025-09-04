import React from "react";
import { formatImageUri } from "../../utils/formatImageUri";

export default function AlbumTable({ data = [], actions }) {
  //   console.log("data in album table===>", data);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Albums</h2>
        <p className="text-gray-500">No albums available</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">Albums</h2>
      <table className="min-w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 text-left py-2 border-b">Thumbnail</th>
            <th className="px-4 text-left py-2 border-b">Album Name</th>
            <th className="px-4 text-left py-2 border-b">Artist ID</th>
            <th className="px-4 text-left py-2 border-b">Genre</th>
            <th className="px-4 text-left py-2 border-b">Likes</th>
            <th className="px-4 text-left py-2 border-b">Plays</th>
            {actions && <th className="px-4 py-2 border-b">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((album, index) => (
            <tr
              key={album._id || index}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-2 border-b">
                <img
                  src={`/api/${formatImageUri(album.thumbnail_path)}`}
                  alt={album.album_name}
                  className="w-12 h-12 object-cover rounded"
                />
              </td>
              <td className="px-4 py-2 border-b">{album.album_name}</td>
              <td className="px-4 py-2 border-b">{album.artist_id}</td>
              <td className="px-4 py-2 border-b">
                {Array.isArray(album.genre) ? album.genre.join(", ") : "-"}
              </td>
              <td className="px-4 py-2 border-b">{album.likes}</td>
              <td className="px-4 py-2 border-b">{album.play_counter}</td>
              {actions && (
                <td className="px-4 py-2 border-b">{actions(album)}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
