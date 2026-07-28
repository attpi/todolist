document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.querySelector("#taskInput");
  const addBtn = document.querySelector("#addBtn");
  const todoList = document.querySelector(".todo-list");
  const doneList = document.querySelector(".doneList");

  const formatFinishTime = (date = new Date()) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
    return y + "/" + m + "/" + d + " " + hh + ":" + mm + ":" + ss;
  };

  const createTodoItem = (text) => {
    const li = document.createElement("li");
    li.className = "todo-item";

    const left = document.createElement("div");
    left.className = "item-left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "completeCheck";
    checkbox.setAttribute("aria-label", "標記完成");

    const span = document.createElement("span");
    span.className = "item";
    span.textContent = text;

    left.append(checkbox, span);

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "closeBtn";
    closeBtn.textContent = "X";
    closeBtn.setAttribute("aria-label", "刪除");

    li.append(left, closeBtn);
    return li;
  };

  const createDoneItem = (text, finishTime) => {
    const li = document.createElement("li");
    li.className = "doneTask";

    const span = document.createElement("span");
    span.className = "task";
    span.textContent = text;

    const time = document.createElement("span");
    time.className = "finishTime";
    time.textContent = finishTime;

    const rollbackBtn = document.createElement("button");
    rollbackBtn.type = "button";
    rollbackBtn.className = "rollbackBtn";
    rollbackBtn.textContent = "V";
    rollbackBtn.title = "還原為待辦";
    rollbackBtn.setAttribute("aria-label", "還原為待辦");

    li.append(span, time, rollbackBtn);
    return li;
  };

  const addTask = () => {
    const task = taskInput.value.trim();
    if (!task) {
      taskInput.focus();
      return;
    }
    todoList.insertAdjacentElement("afterbegin", createTodoItem(task));
    taskInput.value = "";
    taskInput.focus();
  };

  const completeTask = (todoItem) => {
    const text = todoItem.querySelector(".item").textContent;
    const finishTime = formatFinishTime();
    todoItem.remove();
    doneList.insertAdjacentElement(
      "afterbegin",
      createDoneItem(text, finishTime)
    );
  };

  const rollbackTask = (doneItem) => {
    const text = doneItem.querySelector(".task").textContent;
    doneItem.remove();
    todoList.insertAdjacentElement("afterbegin", createTodoItem(text));
  };

  addBtn.addEventListener("click", addTask);

  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  });

  todoList.addEventListener("click", (e) => {
    if (e.target.classList.contains("closeBtn")) {
      e.target.closest(".todo-item").remove();
    }
  });

  todoList.addEventListener("change", (e) => {
    if (e.target.classList.contains("completeCheck") && e.target.checked) {
      completeTask(e.target.closest(".todo-item"));
    }
  });

  doneList.addEventListener("click", (e) => {
    if (e.target.classList.contains("rollbackBtn")) {
      rollbackTask(e.target.closest(".doneTask"));
    }
  });
});
