import fs from 'fs';

export default class DB {
    static existsDB() {
        if (fs.existsSync(process.env.DB_FILE)) {
            return true;
        } else {
            return false;
        }
    }
    static createDB() {
        if (this.existsDB()) {
            return false;
        } else {
            try {
                fs.writeFileSync(process.env.DB_FILE, "[]");
                return true;
            } catch (e) {
                throw new Error("Can't create DB file");
            }
        }
    }
    static resetDB() {
        try {
            fs.writeFileSync(process.env.DB_FILE, "[]");
        } catch (e) {
            throw new Error("can't reset this file");
        }
    }
    static searchElementById(i) {
        let data = [];
        try {
            data = JSON.parse(fs.readFileSync(process.env.DB_FILE, "utf-8"));
        } catch (e) {
            throw new Error("Can't Read or Parse data from DB file");
        }

        const result = data.find((each) => {
            if (Number(each.id) === Number(i)) {
                return true;
            }
        });

        if (result) {
            return result;
        } else {
            return false;
        }
    }
    static searchElementByTitle(i) {
        let data = [];
        try {
            data = JSON.parse(fs.readFileSync(process.env.DB_FILE, "utf-8"));
        } catch (e) {
            throw new Error("Can't Read or Parse data from DB file");
        }

        const result = data.find((each) => {
            if (each.title === i) {
                return true;
            }
        });

        if (result) {
            return result;
        } else {
            return false;
        }
    }
    static allData() {
        let data = [];
        try {
            data = JSON.parse(fs.readFileSync(process.env.DB_FILE, "utf-8"));
        } catch (e) {
            throw new Error("Can't Read or Parse data from DB file");
        }
        return data;
    }
    static addTask(title, completed) {
        let data = [];
        try {
            data = JSON.parse(fs.readFileSync(process.env.DB_FILE, "utf-8"));
        } catch (e) {
            throw new Error("Can't Read or Parse DB file");
        }

        for (let i = 0; i < data.length; i++) {
            if (data[i].title === title) {
                throw new Error("This title used once");
            }
        }

        if (data.length === 0) {
            data.push({
                id: 1,
                title: title,
                completed: completed
            });
        } else {
            data.push({
                id: (data[data.length - 1].id + 1),
                title: title,
                completed: completed
            });
        }

        let temp;
        try {
            if (data.length === 0) {
                temp = 1;
            } else {
                temp = data[data.length - 1].id;
            }
            data = JSON.stringify(data);
            fs.writeFileSync(process.env.DB_FILE, data);
            return temp;
        } catch (e) {
            throw new Error("Can't write on DB file");
        }
    }
    static editTask(id, title, completed) {
        id = Number(id);
        let data = [];
        if (id <= 0 || id !== parseInt(id)) {
            throw new Error("Id must be a number bigger than 0");
        }

        try {
            data = JSON.parse(fs.readFileSync(process.env.DB_FILE, "utf-8"));
        } catch (e) {
            throw new Error("Can't Read or Parse DB file");
        }

        for (let i = 0; i < data.length; i++) {
            if (data[i].id === id) {
                for (let j = 0; j < data.length; j++) {
                    if (j !== i) {
                        if (data[j].title === title) {
                            throw new Error("This title used in another task");
                        }
                    }
                }
                data[i].title = title;
                data[i].completed = completed;

                try {
                    data = JSON.stringify(data);
                    fs.writeFileSync(process.env.DB_FILE, data);
                    return true;
                } catch (e) {
                    throw new Error("Can't write on DB file");
                }
            }
        }

        return false;
    }
    static deleteTaskById(i) {
        i = Number(i);
        let data = [];
        if (i <= 0 || i !== parseInt(i)) {
            throw new Error("ID must be an integer bigger than 0");
        }

        try {
            data = JSON.parse(fs.readFileSync(process.env.DB_FILE, "utf-8"));
        } catch (e) {
            throw new Error("Can't Read or Parse DB file");
        }

        for (let j = 0; j < data.length; j++) {
            if (data[j].id === i) {
                data.splice(j, 1);

                try {
                    data = JSON.stringify(data);
                    fs.writeFileSync(process.env.DB_FILE, data);
                    return true;
                } catch (e) {
                    throw new Error("Can't Write on DB file");
                }
            }
        }

        return false;
    }
    static importData(data) {
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data);
            } catch (e) {
                throw new Error("Invalid input");
            }
        }

        if (data instanceof Array) {
            try {
                fs.writeFileSync(process.env.DB_FILE, JSON.stringify(data));
            } catch (e) {
                throw new Error("Can't write on DB file");
            }
        } else {
            throw new Error("Invalid input");
        }
    }
}