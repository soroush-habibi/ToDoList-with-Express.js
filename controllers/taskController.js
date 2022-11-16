import Task from "../models/task.js";
import DB from "../models/db.js";

export default class taskController {
    static getTasks(req, res, next) {
        let tasks;
        let pageCount = 0;
        try {
            tasks = Task.allData(true);
        } catch (e) {
            res.status(500).json({
                success: false,
                body: null,
                message: "DB Error"
            });
            return;
        }
        if (Object.keys(req.query).length === 3) {
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const status = parseInt(req.query.status);            //0 => all   ,   1 => completed   ,   2 => in progress
            pageCount = parseInt(Object.keys(tasks).length / limit);

            if (page <= 0 || limit <= 0) {
                res.status(400).json({
                    success: false,
                    body: null,
                    message: "Bad Request"
                });
                return;
            }

            if (status == 0) {
                tasks = tasks.slice((page - 1) * limit, page * limit);
            } else if (status == 1) {
                tasks = tasks.filter((value) => {
                    if (value.completed) {
                        return true;
                    } else {
                        return false;
                    }
                });
                tasks = tasks.slice((page - 1) * limit, page * limit);
            } else if (status == 2) {
                tasks = tasks.filter((value) => {
                    if (value.completed) {
                        return false;
                    } else {
                        return true;
                    }
                });
                tasks = tasks.slice((page - 1) * limit, page * limit);
            } else {
                res.status(400).json({
                    success: false,
                    body: null,
                    message: "Bad Request"
                });
                return;
            }
        }
        res.json({
            success: true,
            body: tasks,
            message: "OK",
            pageCount
        });
    }

    static getTaskById(req, res, next) {
        try {
            const task = Task.searchElementById(req.params.id);
            if (task) {
                res.json({
                    success: true,
                    body: task,
                    message: "OK"
                });
            } else {
                res.status(404).json({
                    success: false,
                    body: null,
                    message: "Not Found"
                });
            }
        } catch (e) {
            res.status(500).json({
                success: false,
                body: null,
                message: "DB Error"
            });
        }
    }

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
                res.status(201).json({
                    success: true,
                    body: task.id,
                    message: "OK"
                });
            } catch (e) {
                res.status(400).json({
                    success: false,
                    body: null,
                    message: e.message
                });
            }
        } else {
            res.status(400).json({
                success: false,
                body: null,
                message: "Bad Request"
            });
        }
    }

    static editTask(req, res, next) {
        if (req.params.id && req.body.title) {
            if (req.body.title.length >= 3) {
                try {
                    const task = Task.searchElementById(req.params.id);
                    if (task) {
                        task.title = req.body.title;
                        task.save();
                        res.status(201).json({
                            success: true,
                            body: true,
                            message: "OK"
                        });
                    } else {
                        res.status(202).json({
                            success: false,
                            body: false,
                            message: "fail to edit"
                        });
                    }
                } catch (e) {
                    res.status(400).json({
                        success: false,
                        body: null,
                        message: e.message
                    });
                }
            } else {
                res.status(400).json({
                    success: false,
                    body: null,
                    message: "Title should be at least 3 character"
                });
            }
        } else {
            res.status(400).json({
                success: false,
                body: null,
                message: "Bad Request"
            });
        }
    }

    static deleteTask(req, res, next) {
        if (req.params.id) {
            try {
                const bool = DB.deleteTaskById(req.params.id);
                if (bool) {
                    res.json({
                        success: true,
                        body: true,
                        message: "OK"
                    });
                } else {
                    res.status(404).json({
                        success: false,
                        body: false,
                        message: "Can't find"
                    });
                }
            } catch (e) {
                res.status(500).json({
                    success: false,
                    body: null,
                    message: e.message
                });
            }
        } else {
            res.status(400).json({
                success: false,
                body: null,
                message: "Bad Request"
            });
        }
    }

    static toggleTask(req, res, next) {
        if (req.params.id) {
            try {
                const task = Task.searchElementById(req.params.id);

                if (task) {
                    task.completed = !task.completed;
                    task.save();

                    if (task.completed) {
                        res.status(201).json({
                            success: true,
                            body: true,
                            message: "OK"
                        });
                    } else {
                        res.status(201).json({
                            success: true,
                            body: false,
                            message: "OK"
                        });
                    }
                } else {
                    res.status(404).json({
                        success: false,
                        body: null,
                        message: "Not Found"
                    });
                }
            } catch (e) {
                res.status(400).json({
                    success: false,
                    body: null,
                    message: e.message
                });
            }
        } else {
            res.status(400).json({
                success: false,
                body: null,
                message: "Bad Request"
            });
        }
    }
}