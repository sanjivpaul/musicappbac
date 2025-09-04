import React from "react";
import { formatImageUri } from "../../utils/formatImageUri";
import { CapitalizeWords } from "../../utils/CapitalizeWords";

export default function SongTable({ data = [], actions }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Songs</h2>
        <p className="text-gray-500">No songs available</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">Songs</h2>
      <table className="min-w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 text-left py-2 border-b">Thumbnail</th>
            <th className="px-4 text-left py-2 border-b">Song Name</th>
            <th className="px-4 text-left py-2 border-b">Language</th>
            <th className="px-4 text-left py-2 border-b">Bitrate</th>
            <th className="px-4 text-left py-2 border-b">Artist</th>
            <th className="px-4 text-left py-2 border-b">Album</th>
            <th className="px-4 text-left py-2 border-b">Likes</th>
            <th className="px-4 text-left py-2 border-b">Plays</th>
            {actions && <th className="px-4 py-2 border-b">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((song, index) => (
            <tr
              key={song._id || index}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-4  py-2 border-b">
                <img
                  src={`/api/${formatImageUri(song.thumbnail_path)}`}
                  alt={song.song_name}
                  className="w-12 h-12 object-cover rounded"
                />
              </td>
              <td className="px-4 py-2 border-b">
                {CapitalizeWords(song.song_name)}
              </td>
              <td className="px-4 py-2 border-b">
                {CapitalizeWords(song.language)}
              </td>
              <td className="px-4 py-2 border-b">{song.bitrate} kbps</td>
              <td className="px-4 py-2 border-b">
                {CapitalizeWords(song.artist_id?.artist_name) || "-"}
              </td>
              <td className="px-4 py-2 border-b">
                {CapitalizeWords(song.album_id?.album_name) || "-"}
              </td>
              <td className="px-4 py-2 border-b">{song.likes}</td>
              <td className="px-4 py-2 border-b">{song.play_counter}</td>
              {actions && (
                <td className="px-4 py-2 border-b">{actions(song)}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
