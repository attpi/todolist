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
    li.draggable = true;

    const left = document.createElement("div");
    left.className = "item-left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "completeCheck";
    checkbox.setAttribute("aria-label", "標記完成");

    const span = document.createElement("span");
    span.className = "item";
    span.textContent = text;
    span.title = "雙擊可編輯";

    left.append(checkbox, span);

    const actions = document.createElement("div");
    actions.className = "item-actions";

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "editBtn";
    editBtn.textContent = "編輯";
    editBtn.setAttribute("aria-label", "編輯");

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "closeBtn";
    closeBtn.textContent = "X";
    closeBtn.setAttribute("aria-label", "刪除");

    actions.append(editBtn, closeBtn);
    li.append(left, actions);
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

  const startEdit = (todoItem) => {
    const span = todoItem.querySelector(".item");
    if (!span || todoItem.querySelector(".editInput")) return;

    const original = span.textContent;
    const input = document.createElement("input");
    input.type = "text";
    input.className = "editInput";
    input.value = original;

    const finish = (save) => {
      const next = input.value.trim();
      if (save && next) {
        span.textContent = next;
      }
      input.replaceWith(span);
    };

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        finish(true);
      } else if (e.key === "Escape") {
        finish(false);
      }
    });
    input.addEventListener("blur", () => finish(true));

    span.replaceWith(input);
    input.focus();
    input.select();
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


  let dragItem = null;

  todoList.addEventListener("dragstart", (e) => {
    const item = e.target.closest(".todo-item");
    if (!item || e.target.matches("input, button, .editInput")) {
      e.preventDefault();
      return;
    }
    dragItem = item;
    item.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
  });

  todoList.addEventListener("dragend", (e) => {
    const item = e.target.closest(".todo-item");
    if (item) item.classList.remove("dragging");
    dragItem = null;
    todoList.querySelectorAll(".drag-over").forEach((el) => {
      el.classList.remove("drag-over");
    });
  });

  todoList.addEventListener("dragover", (e) => {
    e.preventDefault();
    const after = getDragAfterElement(todoList, e.clientY);
    const dragging = dragItem;
    if (!dragging) return;
    if (after == null) {
      todoList.appendChild(dragging);
    } else {
      todoList.insertBefore(dragging, after);
    }
  });

  const getDragAfterElement = (container, y) => {
    const elements = [...container.querySelectorAll(".todo-item:not(.dragging)")];
    return elements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child };
        }
        return closest;
      },
      { offset: Number.NEGATIVE_INFINITY, element: null }
    ).element;
  };

  addBtn.addEventListener("click", addTask);

  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  });

  todoList.addEventListener("click", (e) => {
    const todoItem = e.target.closest(".todo-item");
    if (!todoItem) return;

    if (e.target.classList.contains("closeBtn")) {
      todoItem.remove();
      return;
    }
    if (e.target.classList.contains("editBtn")) {
      startEdit(todoItem);
    }
  });

  todoList.addEventListener("dblclick", (e) => {
    if (e.target.classList.contains("item")) {
      startEdit(e.target.closest(".todo-item"));
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
