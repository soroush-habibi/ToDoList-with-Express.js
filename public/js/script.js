const ul = document.querySelector("ul");
const h2 = document.querySelector("h2");
const form = document.querySelector("form");
const inputTitle = document.querySelector(".input-title");
const inputCompleted = document.querySelector(".input-completed");
const allRadio = document.querySelector("#all");
const completedRadio = document.querySelector("#completed");
const inProgressRadio = document.querySelector("#in-progress");
const pagination = document.querySelector("#pagination");
const leftButton = document.querySelector("#prev-button");
const rightButton = document.querySelector("#next-button");
const pageLabel = document.querySelector("#page-label");

let limit = 5;
let currentPage = 1;
let mode = 0;
let pageCount;

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let response;
    let id;
    let title;
    let completed;

    ul.classList.remove("d-none");
    h2.classList.add("d-none");

    try {
        if (inputCompleted.checked) {
            title = inputTitle.value;
            completed = inputCompleted.checked;
            response = await axios.post("/tasks", { title, completed });
            id = Number(response.data.body);
        } else {
            title = inputTitle.value;
            completed = inputCompleted.checked;
            response = await axios.post("/tasks", { title });
            id = Number(response.data.body);
        }

        if (response.status !== 400) {
            loadTasks();
            inputTitle.value = "";
        } else {
            alert(response.data.message);
        }
    } catch (e) {
        alert(e.response.data.message);
    }
});

ul.addEventListener('click', async (e) => {
    const element = e.target;
    const id = parseInt(element.parentElement.dataset.id);          //read data-id custom attribute
    if (element.classList.contains("toggle-btn")) {
        let response;
        try {
            response = await axios.patch(`/tasks/${id}`, { id });
            if (response.data.body === true) {
                element.parentElement.querySelector(".user-select-none").innerHTML = "Completed";
                element.parentElement.querySelector(".user-select-none").classList.remove("bg-secondary");
                element.parentElement.querySelector(".user-select-none").classList.add("bg-success");
                element.classList.remove("btn-success");
                element.classList.add("btn-secondary");
            } else {
                element.parentElement.querySelector(".user-select-none").innerHTML = "In progress";
                element.parentElement.querySelector(".user-select-none").classList.remove("bg-success");
                element.parentElement.querySelector(".user-select-none").classList.add("bg-secondary");
                element.classList.remove("btn-secondary");
                element.classList.add("btn-success");
            }

            // location.reload();
        } catch (e) {
            console.log(e.response.data.message);
        }
    } else if (element.classList.contains("delete-btn")) {
        if (confirm("Are you sure?")) {
            let response;
            try {
                response = await axios.delete(`/tasks/${id}`);
                if (response.data.body === true) {
                    element.parentElement.remove();
                    if (!document.querySelectorAll("li").length && currentPage === 1) {
                        ul.classList.add("d-none");
                        h2.classList.remove("d-none");
                        loadTasks();
                    } else if (!document.querySelectorAll("li").length) {
                        currentPage--;
                        loadTasks();
                    }
                    loadTasks();
                } else {
                    alert("Not Found!");
                }
            } catch (e) {
                console.log(e.message);
            }
        }
    } else if (element.classList.contains("edit-btn")) {
        const title = element.parentElement.querySelector("label").innerHTML;
        const answer = prompt("Enter new title:", title);

        if (answer && answer.length >= 3) {
            try {
                const response = await axios.put(`/tasks/${id}`, { title: answer });
                if (response.data.body === true) {
                    element.parentElement.querySelector("label").innerHTML = answer;
                } else if (response.data.body === false) {
                    alert("Not Found");
                } else {
                    alert(response.data.message)
                }
            } catch (e) {
                alert(e.response.data.message);
            }
        } else if (answer) {
            alert("Title must be at least 3 character");
        }
    }
});

document.addEventListener("DOMContentLoaded", (e) => {
    allRadio.checked = true;
    completedRadio.checked = false;
    inProgressRadio.checked = false;
    loadTasks();
});

rightButton.addEventListener('click', (e) => {
    currentPage++;
    loadTasks();
});

leftButton.addEventListener('click', (e) => {
    currentPage--;
    loadTasks();
});

allRadio.addEventListener("change", (e) => {
    h2.classList.add("d-none");
    currentPage = 1;
    mode = 0;
    loadTasks();
});

completedRadio.addEventListener("change", (e) => {
    h2.classList.add("d-none");
    currentPage = 1;
    mode = 1;
    loadTasks();
});

inProgressRadio.addEventListener("change", (e) => {
    h2.classList.add("d-none");
    currentPage = 1;
    mode = 2;
    loadTasks();
});

async function loadTasks() {
    try {
        const response = await axios.get(`/tasks?page=${currentPage}&limit=${limit}&status=${mode}`);
        if (response.data.body instanceof Array) {
            if (response.data.body.length > 0) {
                ul.classList.remove("d-none");
                pageCount = response.data.pageCount;
                if (pageCount > 1) {
                    if (currentPage === 1) {
                        leftButton.disabled = true;
                        rightButton.disabled = false;
                    } else if (currentPage === pageCount) {
                        leftButton.disabled = false;
                        rightButton.disabled = true;
                    } else {
                        leftButton.disabled = false;
                        rightButton.disabled = false;
                    }
                    pagination.classList.remove("d-none");
                } else {
                    pagination.classList.add("d-none");
                }
                ul.classList.remove("d-none");
                pageLabel.innerHTML = `Page ${currentPage} of ${pageCount}`;
                let str = "";

                for (let item of response.data.body) {
                    str += `<li class="list-group-item d-flex bg-light" data-id="${item.id}">
                    <span class="flex-grow-1 d-flex align-items-center">
                        <label>${item.title}</label>
                        <span class="badge ${item.completed ? " bg-success" : "bg-secondary"} ms-auto me-3
                            user-select-none">${item.completed ? "Completed" : "In progress"}</span>
                    </span>
                    <button class="btn btn-sm ${item.completed ? " btn-secondary" : "btn-success"} me-3
                        toggle-btn">Toggle</button>
                    <button class="btn btn-sm btn-primary me-3 edit-btn">Edit</button>
                    <button class="btn btn-sm btn-danger delete-btn">Delete</button>
                </li>`
                }

                ul.innerHTML = str;
            } else {
                pagination.classList.add("d-none");
                ul.innerHTML = "";
                ul.classList.add("d-none");
                h2.classList.remove("d-none");
            }
        } else {
            console.log("Data is corrupted");
        }
    } catch (e) {
        console.log(e.message);
    }
}