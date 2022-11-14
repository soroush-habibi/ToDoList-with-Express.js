import Task from "../models/task.js"

export default class getController {
    static homePage(req, res, next) {
        const tasks = Task.allData(true);
        res.render("template.ejs", { tasks });
    }
}