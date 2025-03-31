import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
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

app.use("/song", songRouter);
app.use("/artist", artistRoute);
app.use("/album", albumRoute);
app.use("/songplaylist", songPlayListRoute);
app.use("/playlist", playlistRouter);
app.use("/user", userRouter);
// app.use("/tasks", taskRouter);

export { app };
