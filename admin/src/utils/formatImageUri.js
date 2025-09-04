export const formatImageUri = (path, baseUrl = "") => {
  if (!path) return "https://placeholder.com/default-image.jpg";

  // Remove 'public/' from the path if it exists
  const cleanPath = path.replace("public/", "");

  // Return with base URL if provided
  return baseUrl ? `${baseUrl}${cleanPath}` : cleanPath;
};
