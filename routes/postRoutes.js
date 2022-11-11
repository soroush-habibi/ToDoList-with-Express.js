import express from "express";

import postController from "../controllers/postController.js";

const router = express.Router();

router.post("/add-task", postController.addTask);

router.post("/toggle-task", postController.toggleTask);

router.post("/delete-task", postController.deleteTask);

router.post("/edit-task", postController.editTask);

export default router;