import express from "express";
import fs from "fs";

const router = express.Router();

router.get("/", (req, res, next) => {
    res.send(fs.readFileSync("./template.html", "utf-8"));
});

export default router;