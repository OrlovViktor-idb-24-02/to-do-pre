let items = [
  "Сделать проектную работу",
  "Полить цветы",
  "Пройти туториал по Реакту",
  "Сделать фронт для своего проекта",
  "Прогуляться по улице в солнечный день",
  "Помыть посуду",
];

const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");

function loadTasks() {
  try {
    const saved = localStorage.getItem("tasks");
    if (saved === null) return items;
    const tasks = JSON.parse(saved);
    if (Array.isArray(tasks) && tasks.every((task) => typeof task === "string"))
      return tasks;
  } catch (error) {
    console.warn("Не удалось прочитать сохранённые задачи.", error);
  }
  return items;
}

function createItem(item) {
  const template = document.getElementById("to-do__item-template");
  const clone = template.content.querySelector(".to-do__item").cloneNode(true);
  const textElement = clone.querySelector(".to-do__item-text");
  const deleteButton = clone.querySelector(".to-do__item-button_type_delete");
  const duplicateButton = clone.querySelector(
    ".to-do__item-button_type_duplicate",
  );
  const editButton = clone.querySelector(".to-do__item-button_type_edit");
  textElement.textContent = item;
  let previousText = item;
  deleteButton.addEventListener("click", () => {
    clone.remove();
    persistTasks();
  });
  duplicateButton.addEventListener("click", () => {
    const itemName = textElement.textContent;
    listElement.prepend(createItem(itemName));
    persistTasks();
  });
  editButton.addEventListener("click", () => {
    previousText = textElement.textContent;
    textElement.setAttribute("contenteditable", "true");
    textElement.focus();
  });
  textElement.addEventListener("blur", () => {
    textElement.textContent = textElement.textContent.trim() || previousText;
    textElement.setAttribute("contenteditable", "false");
    persistTasks();
  });
  textElement.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      textElement.blur();
    }
    if (event.key === "Escape") {
      textElement.textContent = previousText;
      textElement.blur();
    }
  });
  return clone;
}

function getTasksFromDOM() {
  const itemsNamesElements = listElement.querySelectorAll(".to-do__item-text");
  const tasks = [];
  itemsNamesElements.forEach((item) => tasks.push(item.textContent));
  return tasks;
}

function saveTasks(tasks) {
  try {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } catch (error) {
    console.warn("Не удалось сохранить задачи в браузере.", error);
  }
}

function persistTasks() {
  items = getTasksFromDOM();
  saveTasks(items);
}

formElement.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = inputElement.value.trim();
  if (!text) return;
  listElement.prepend(createItem(text));
  persistTasks();
  inputElement.value = "";
  inputElement.focus();
});

items = loadTasks();
items.forEach((item) => listElement.append(createItem(item)));
