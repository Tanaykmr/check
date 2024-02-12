import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/user";
import todoRoutes from "./routes/todos";
import cors from "cors";



const app = express();
const port = 3000;

import dotenv from "dotenv";
dotenv.config({ path: "./config/.env.local" });
const url = process.env.MONGOOSE_URL;
if (!url) {
  console.error(
    "MONGOOSE_URL is not defined in the environment variables in user.ts."
  );
  process.exit(1);
}
app.use(cors());
app.use(express.json());
app.use("/user", userRoutes);
app.use("/todos", todoRoutes);

mongoose.connect(url);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
