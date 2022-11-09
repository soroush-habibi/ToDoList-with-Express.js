import util from 'util';
import chalk from 'chalk';
import DB from './db.js'

export default class Task {
    #id = 0;
    #title;
    #completed;
    constructor(title, completed) {
        this.#title = title;
        this.#completed = completed;
    }

    get id() {
        return this.#id;
    }

    get title() {
        return this.#title;
    }

    get completed() {
        return this.#completed;
    }

    set title(value) {
        if (typeof value !== "string") {
            throw new Error("Title must be string");
        } else {
            this.#title = value;
        }
    }

    set completed(value) {
        this.#completed = Boolean(value);
    }

    [util.inspect.custom]() {
        return `Task{
            ID : ${chalk.greenBright.bold(this.#id)},
            Title : ${chalk.magentaBright.bold(this.#title)},
            Completed: ${chalk.yellowBright.bold(this.#completed)}
        }`
    }

    save() {
        if (this.#id === 0) {
            try {
                this.#id = DB.addTask(this.#title, this.#completed);
            } catch (e) {
                throw new Error(e.message);
            }

        } else {
            try {
                DB.editTask(this.#id, this.#title, this.#completed);
            } catch (e) {
                throw new Error(e.message);
            }
        }
    }

    static searchElementById(value) {
        const item = DB.searchElementById(value);

        if (item) {
            const newItem = new Task(item.title, item.completed);
            newItem.#id = item.id;
            return newItem;
        } else {
            return false;
        }
    }

    static searchElementByTitle(value) {
        const item = DB.searchElementByTitle(value);

        if (item) {
            const newItem = new Task(item.title, item.completed);
            newItem.#id = item.id;
            return newItem;
        } else {
            return false;
        }
    }

    static allData(rawList = false, bool = false) {
        const items = DB.allData();
        let data = [];

        if (rawList) {
            if (bool) {
                for (let item of items) {
                    if (item.completed) {
                        item.completed = "true";
                    } else {
                        item.completed = "false";
                    }
                }
            }
            return items;
        }

        if (items) {
            for (let item of items) {
                const newItem = new Task(item.title, item.completed);
                newItem.#id = item.id;
                data.push(newItem);
            }
            return data;
        } else {
            return false;
        }
    }
}