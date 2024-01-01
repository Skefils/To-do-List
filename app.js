window.addEventListener("load", async () => {
  const apiKey = "4fd05367-8244-46ce-aeb4-06922ca042b1";
  const form = document.querySelector("#new-task-form");
  const input = document.querySelector("#new-task-input");
  const list_el = document.querySelector("#tasks");

  /*   const inputValue = input.value; */
  const fetchTasks = async () => {
    try {
      const apiUrl = `https://js1-todo-api.vercel.app/api/todos?apikey=${apiKey}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const tasksData = await response.json();

      list_el.innerHTML = "";

      tasksData.forEach((taskData) => {
        const task_el = document.createElement("div");
        task_el.classList.add("task");

        const task_content_el = document.createElement("div");
        task_content_el.classList.add("content");
        task_el.appendChild(task_content_el);

        const task_input_el = document.createElement("input");
        task_input_el.classList.add("text");
        task_input_el.type = "text";
        task_input_el.value = taskData.title;
        task_input_el.setAttribute("readonly", "readonly");
        task_content_el.appendChild(task_input_el);

        const task_actions_el = document.createElement("div");
        task_actions_el.classList.add("actions");

        const task_edit_el = document.createElement("button");
        task_edit_el.classList.add("edit");
        task_edit_el.innerHTML = "Edit";

        const task_delete_el = document.createElement("button");
        task_delete_el.classList.add("delete");
        task_delete_el.innerHTML = "Delete";

        const task_save_el = document.createElement("button");
        task_save_el.classList.add("save");
        task_save_el.innerHTML = "Save";
        task_save_el.style.display = "none";

        task_actions_el.appendChild(task_edit_el);
        task_actions_el.appendChild(task_delete_el);
        task_actions_el.appendChild(task_save_el);

        task_el.appendChild(task_actions_el);

        list_el.appendChild(task_el);

        task_edit_el.addEventListener("click", () => {
          task_input_el.removeAttribute("readonly");
          task_input_el.focus();
          task_edit_el.style.display = "none";
          task_save_el.style.display = "inline-block";
        });

        task_save_el.addEventListener("click", async () => {
          task_input_el.setAttribute("readonly", "readonly");
          task_edit_el.style.display = "inline-block";
          task_save_el.style.display = "none";

          const updateApiUrl = `https://js1-todo-api.vercel.app/api/todos/${taskData._id}?apikey=${apiKey}`;

          try {
            const updateResponse = await fetch(updateApiUrl, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ title: task_input_el.value }),
            });

            if (!updateResponse.ok) {
              throw new Error("Failed to update task");
            }
          } catch (error) {
            console.error("Error updating task:", error.message);
          }
        });

        task_delete_el.addEventListener("click", async () => {
          list_el.removeChild(task_el);

          const deleteApiUrl = `https://js1-todo-api.vercel.app/api/todos/${taskData._id}?apikey=${apiKey}`;

          try {
            const deleteResponse = await fetch(deleteApiUrl, {
              method: "DELETE",
            });

            if (!deleteResponse.ok) {
              throw new Error("Failed to delete task");
            }
          } catch (error) {
            console.error("Error deleting task:", error.message);
          }
        });
      });
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
    }
  };

  fetchTasks();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const task = input.value;
    if (!task) {
      alert("Please enter a valid task");
      return;
    }

    const apiUrl = `https://js1-todo-api.vercel.app/api/todos?apikey=4fd05367-8244-46ce-aeb4-06922ca042b1`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: task, title: task }),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      fetchTasks();

      input.value = "";
    } catch (error) {
      console.error("Error adding task:", error.message);
    }
  });
});
