import express from "express";

import Task from "./task.js"

const router = express.Router();

router.post("/add-task", (req, res, next) => {
    if (req.body.title && req.body.title.length >= 3) {
        const title = req.body.title;
        let completed = false;
        if (req.body.completed) {
            completed = true;
        }

        try {
            const task = new Task(title, completed);
            task.save();
        } catch (e) {
            res.status(401).send(`<h1>${e.message}</h1>`);
        }

        res.redirect("/");
    } else {
        res.status(401).send("<h1>Bad Request</h1>");
    }
});

export default router;