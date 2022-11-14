import Task from "../models/task.js"
import DB from "../models/db.js";

export default class postController {
    static addTask(req, res, next) {
        if (req.body.title && req.body.title.length >= 3) {
            const title = req.body.title;
            let completed = false;
            if (req.body.completed) {
                completed = true;
            }
            try {
                const task = new Task(title, completed);
                task.save();
                res.json(task.id);
            } catch (e) {
                res.status(400).send(e.message);
            }
        } else {
            res.status(400).send("Bad Request");
        }
    }

    static toggleTask(req, res, next) {
        if (req.body.id) {
            const task = Task.searchElementById(Number(req.body.id));
            if (task) {
                task.completed = !task.completed;
                try {
                    task.save();
                } catch (e) {
                    res.send(e.message);
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
            res.status(400).send("<h1>Bad Request</h1>");
        }
    }

    static deleteTask(req, res, next) {
        if (req.body.id) {
            try {
                const bool = DB.deleteTaskById(req.body.id);
                if (bool) {
                    res.json("true");
                } else {
                    res.json("false");
                }
            } catch (e) {
                res.status(500).send(e.message);
            }
        } else {
            res.status(400).send("<h1>Bad Request</h1>");
        }
    }

    static editTask(req, res, next) {
        if (req.body.id && req.body.title) {
            if (req.body.title.length >= 3) {
                try {
                    const task = Task.searchElementById(req.body.id);
                    if (task) {
                        task.title = req.body.title;
                        task.save();
                        res.json(true);
                    } else {
                        res.json(false);
                    }
                } catch (e) {
                    res.status(400).send(e.message);
                }
            } else {
                res.status(400).send("Title should be at least 3 character");
            }
        }
    }
}