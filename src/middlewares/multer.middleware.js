// import multer from "multer";

// // Storage for music files
// const musicStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/data/music");
//   },
//   //   filename: function (req, file, cb) {
//   //     cb(null, file.originalname);
//   //   },

//   filename: function (req, file, cb) {
//     // Keep original filename but add timestamp to prevent duplicates
//     const uniqueName = `${Date.now()}-${file.originalname}`;
//     cb(null, uniqueName);
//   },
// });

// // Storage for image files
// const imageStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/data/images");
//   },
//   //   filename: function (req, file, cb) {
//   //     cb(null, file.originalname);
//   //   },
//   filename: function (req, file, cb) {
//     // Keep original filename but add timestamp to prevent duplicates
//     const uniqueName = `${Date.now()}-${file.originalname}`;
//     cb(null, uniqueName);
//   },
// });

// // File filter to accept only audio and image files
// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype.startsWith("audio/") ||
//     file.mimetype.startsWith("image/")
//   ) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only audio and image files are allowed!"), false);
//   }
// };

// // Create separate upload middlewares
// export const uploadMusic = multer({ storage: musicStorage });
// export const uploadImage = multer({ storage: imageStorage });

import multer from "multer";
import path from "path";
import fs from "fs"; // Don't forget to import fs

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = "";

    if (file.fieldname === "song") {
      uploadPath = "./public/data/music"; // Changed to music folder
    } else if (file.fieldname === "thumbnail") {
      uploadPath = "./public/data/images"; // Changed to images folder
    }

    // Create directory if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// File filter (unchanged)
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "song") {
    if (!file.originalname.match(/\.(mp3|wav|ogg|m4a)$/i)) {
      return cb(new Error("Only audio files are allowed!"), false);
    }
  } else if (file.fieldname === "thumbnail") {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return cb(new Error("Only image files are allowed!"), false);
    }
  }
  cb(null, true);
};

// Configure Multer upload (unchanged)
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for songs
  },
});
// .fields([
//   { name: "song", maxCount: 1 },
//   { name: "thumbnail", maxCount: 1 },
// ]);
