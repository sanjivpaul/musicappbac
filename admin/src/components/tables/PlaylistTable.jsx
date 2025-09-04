import React from "react";

export default function PlaylistTable({ data, actions }) {
  console.log("data in playlist table===>", data);

  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Playlist Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Public
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Thumbnail
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Created At
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((playlist) => (
            <tr key={playlist._id}>
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                {playlist.playlist_name}
              </td>
              <td className="px-6 py-4 text-gray-700">
                {playlist.description || "-"}
              </td>
              <td className="px-6 py-4">
                {playlist.is_public ? (
                  <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                    Public
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">
                    Private
                  </span>
                )}
              </td>
              <td className="px-6 py-4">
                {playlist.thumbnail_path ? (
                  <img
                    src={playlist.thumbnail_path}
                    alt={playlist.playlist_name}
                    className="h-12 w-12 object-cover rounded-md"
                  />
                ) : (
                  <span className="text-gray-400">No image</span>
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {new Date(playlist.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">{actions && actions(playlist)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
