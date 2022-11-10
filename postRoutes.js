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

router.post("/toggle-task", (req, res, next) => {
    if (req.body.id) {
        const task = Task.searchElementById(Number(req.body.id));
        if (task) {
            task.completed = !task.completed;
            try {
                task.save();
            } catch (e) {
                console.log(e.message);
            }
            if (task.completed) {
                res.json("true");
            } else {
                res.json("false");
            }
        } else {
            res.status(404).send("<h1>Not Found!</h1>");
        }
    } else {
        res.status(401).send("<h1>Bad Request</h1>");
    }
});

export default router;