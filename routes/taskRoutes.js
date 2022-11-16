import express from 'express';

import taskController from '../controllers/taskController.js';

const router = express.Router();

router.get("/", taskController.getTasks);

router.get("/:id", taskController.getTaskById);

router.post("/", taskController.addTask);

router.put("/:id", taskController.editTask);

router.delete("/:id", taskController.deleteTask);

router.patch("/:id", taskController.toggleTask);

export default router;