import path from "path";
import { fileURLToPath } from 'url';
import "dotenv/config";
import express from "express";
import getRoutes from "./routes/getRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import DB from "./models/db.js";

DB.createDB();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', "*");
//     res.setHeader('Access-Control-Allow-Headers', "*");
//     res.setHeader('Access-Control-Allow-Methods', "*");
//     next();
// });

app.use("/", express.urlencoded({ extended: false }));
app.use("/", express.json());
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/", getRoutes);
app.use("/", postRoutes);
app.use("/tasks", taskRoutes);

app.listen(Number(process.env.PORT), () => {
    console.log(`Server is running on port ${Number(process.env.PORT)}`);
})