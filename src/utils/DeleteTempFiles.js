import fs from "fs";

// Helper function to delete temporary files
export const deleteTempFiles = (files) => {
  if (!files) return;

  try {
    if (Array.isArray(files)) {
      files.forEach((file) => {
        if (file?.path) fs.unlinkSync(file.path);
      });
    } else if (files?.path) {
      fs.unlinkSync(files.path);
    }
  } catch (error) {
    console.error("Error deleting temp files:", error);
  }
};
