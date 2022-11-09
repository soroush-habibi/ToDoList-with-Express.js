import path from "path";
import { fileURLToPath } from 'url';
import "dotenv/config";
import express from "express";
import getRoutes from "./getRoutes.js";
import postRoutes from "./postRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use("/", express.urlencoded({ extended: false }));
app.use("/", express.static(path.join(__dirname, "public")))
app.use("/", getRoutes);
app.use("/", postRoutes);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})