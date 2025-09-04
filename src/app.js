import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import flash from "express-flash";
import session from "express-session";
import methodOverride from "method-override";

const app = express();

// Configure EJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Create a 'views' folder in your project root

// Add these before your routes
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

// Make messages available to all views
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

app.use(methodOverride("_method"));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    // credentials: true,
  })
);
app.use(express.static("public"));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// app.get("/", (req, res) => {
//   res.send("Hello Backend Music!");
// });

// import userRouter from "./routes/user/user.routes.js";
// import taskRouter from "./routes/task/task.routes.js";
import songRouter from "../src/routes/songs/song.routes.js";
import artistRoute from "../src/routes/artist/artist.routes.js";
import albumRoute from "../src/routes/album/album.routes.js";
import songPlayListRoute from "../src/routes/songPlaylist/songPlaylist.routes.js";
import playlistRouter from "../src/routes/playlist/playlist.routes.js";
import userRouter from "../src/routes/user/user.routes.js";
import adminRouter from "../src/routes/admin/admin.routes.js";
import downloadSongRouter from "../src/routes/downloadSong/downloadsong.routes.js";
import categoryRouter from "../src/routes/category/category.routes.js";

app.use("/song", songRouter);
app.use("/artist", artistRoute);
app.use("/album", albumRoute);
app.use("/songplaylist", songPlayListRoute);
app.use("/playlist", playlistRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/download", downloadSongRouter);
app.use("/category", categoryRouter);

// app.use("/tasks", taskRouter);

// Example EJS route (you can add more)
// app.get("/", (req, res) => {
//   res.render("index", { title: "Home Page" });
// });

// app.get("/admin", (req, res) => {
//   res.render("index", {
//     title: "Admin Dashboard",
//     // layout: "index",
//   });
// });
// app.get("/songs", (req, res) => {
//   res.render("pages/songs", {
//     title: "Songs",
//     // layout: "index",
//   });
// });

export { app };
