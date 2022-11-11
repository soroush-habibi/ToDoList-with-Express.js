import path from "path";
import { fileURLToPath } from 'url';
import "dotenv/config";
import express from "express";
import getRoutes from "./routes/getRoutes.js";
import postRoutes from "./routes/postRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use("/", express.urlencoded({ extended: false }));
app.use("/", express.json());
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/", getRoutes);
app.use("/", postRoutes);

app.listen(Number(process.env.PORT), () => {
    console.log(`Server is running on port ${Number(process.env.PORT)}`);
})