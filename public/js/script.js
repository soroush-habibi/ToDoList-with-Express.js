const ul = document.querySelector("ul");
const form = document.querySelector("form");
const inputTitle = document.querySelector(".input-title");
const inputCompleted = document.querySelector(".input-completed");

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let response;
    let title;
    let completed;

    try {
        if (inputCompleted.checked) {
            title = inputTitle.value;
            completed = inputCompleted.checked;
            response = await axios.post("/add-task", { title, completed });
        } else {
            title = inputTitle.value;
            completed = inputCompleted.checked;
            response = await axios.post("/add-task", { title: inputTitle.value });
        }

        if (response.data === true) {
            const li = document.createElement('li');
            li.setAttribute('class', 'list-group-item d-flex bg-light');
            li.innerHTML = `<span class="flex-grow-1 d-flex align-items-center">
            <label>${title}</label>
            <span class="badge ${completed ? "bg-success" : "bg-secondary"} ms-auto me-3 user-select-none">${completed ? "Completed" : "In progress"}</span>
        </span>
        <button class="btn btn-sm ${completed ? "btn-secondary" : "btn-success"} me-3 toggle-btn">Toggle</button>
        <button class="btn btn-sm btn-primary me-3 edit-btn">Edit</button>
        <button class="btn btn-sm btn-danger delete-btn">Delete</button>`;
            ul.appendChild(li);
        } else {
            alert(response.data);
        }
    } catch (e) {
        alert(e.response.data);
    }
});

ul.addEventListener('click', async (e) => {
    const element = e.target;
    const id = parseInt(element.parentElement.dataset.id);          //read data-id custom attribute
    if (element.classList.contains("toggle-btn")) {
        let response;
        try {
            response = await axios.post("/toggle-task", { id });
            if (response.data === "true") {
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
            console.log(e.response.data);
        }
    } else if (element.classList.contains("delete-btn")) {
        if (confirm("Are you sure?")) {
            let response;
            try {
                response = await axios.post("/delete-task", { id });
                console.log(response.data);
                if (response.data === "true") {
                    element.parentElement.remove();
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

        console.log(answer);

        if (answer && answer.length >= 3) {
            try {
                const response = await axios.post("/edit-task", { id, title: answer });
                if (response.data === true) {
                    element.parentElement.querySelector("label").innerHTML = answer;
                } else if (response.data === false) {
                    alert("Not Found");
                } else {
                    alert(response.data)
                }
            } catch (e) {
                alert(e.response.data);
            }
        } else if (answer) {
            alert("Title must be at least 3 character");
        }
    }
});