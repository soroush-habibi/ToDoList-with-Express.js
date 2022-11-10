const ul = document.querySelector("ul");

ul.addEventListener('click', async (e) => {
    const element = e.target;
    const id = parseInt(element.parentElement.dataset.id);          //read data-id custom attribute
    if (element.classList.contains("toggle-btn")) {
        let response;
        try {
            response = await axios.post("/toggle-task", { id });
            console.log(response.data);
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
    }
});