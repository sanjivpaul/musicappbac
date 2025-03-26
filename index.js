import dotenv from "dotenv";
import connectDatabase from "./src/db/index.js";
import { app } from "./src/app.js";

dotenv.config({
  path: "./.env",
});

connectDatabase()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Mongo db connection failed", err);
  });
