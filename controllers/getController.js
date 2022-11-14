import Task from "../models/task.js"

import path from "path";
import { fileURLToPath } from 'url';
import { createCipheriv } from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default class getController {
    static homePage(req, res, next) {
        // res.render("template.ejs", { tasks });
        res.sendFile(path.join(__dirname,"../views/template.html"));
    }

    static getAllTasks(req,res){
        try{
            const tasks = Task.allData(true);
            res.json(tasks);
        }catch(e){
            res.status(500).send("DB error");
        }
    }
}