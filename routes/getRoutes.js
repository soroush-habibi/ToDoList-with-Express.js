import express from "express";

import getController from "../controllers/getController.js";

const router = express.Router();

router.get("/", getController.homePage);

router.get("/get-all-tasks",getController.getAllTasks);

export default router;