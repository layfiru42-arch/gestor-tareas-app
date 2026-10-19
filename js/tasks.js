/**
 * Gestiona el listado y el formulario de tareas en el navegador.
 * Los datos viven en memoria para demostrar crear, editar y eliminar
 * sin base de datos. Más adelante cada consulta filtrará por user_id.
 */
const taskState = {
  items: [
    {
      id: "demo-1",
      title: "Leer el enunciado del proyecto",
      description: "Revisar requisitos de HTML, CSS, JavaScript y Supabase.",
      status: "done",
    },
    {
      id: "demo-2",
      title: "Preparar maqueta de pantallas",
      description: "Login, registro y listado de tareas en escritorio y móvil.",
      status: "pending",
    },
  ],
  filter: "all",
};

/**
 * Genera un identificador simple para tareas locales.
 * @returns {string}
 */
function createTaskId() {
  return "task-" + Date.now();
}

/**
 * Devuelve las tareas visibles según el filtro activo.
 * @returns {Array<object>}
 */
function getVisibleTasks() {
  if (taskState.filter === "all") {
    return taskState.items;
  }
  return taskState.items.filter(function (task) {
    return task.status === taskState.filter;
  });
}

/**
 * Pinta la lista de tarjetas o el estado vacío.
 */
function renderTasks() {
  const list = document.getElementById("task-list");
  const empty = document.getElementById("task-empty");
  const visible = getVisibleTasks();

  list.innerHTML = "";
  empty.hidden = visible.length > 0;

  visible.forEach(function (task) {
    const item = document.createElement("li");
    item.className = "task-card";
    item.innerHTML =
      "<div>" +
      "<h3></h3>" +
      "<p></p>" +
      '<div class="task-meta"><span class="badge"></span></div>' +
      "</div>" +
      '<div class="task-actions">' +
      '<button type="button" class="icon-btn" data-action="edit">Editar</button>' +
      '<button type="button" class="icon-btn" data-action="delete">Eliminar</button>' +
      "</div>";

    item.querySelector("h3").textContent = task.title;
    item.querySelector("p").textContent = task.description || "Sin descripción";
    const badge = item.querySelector(".badge");
    badge.textContent = task.status === "done" ? "Completada" : "Pendiente";
    badge.classList.add(task.status === "done" ? "badge-done" : "badge-pending");

    item.querySelector('[data-action="edit"]').addEventListener("click", function () {
      openTaskModal(task.id);
    });
    item.querySelector('[data-action="delete"]').addEventListener("click", function () {
      deleteTask(task.id);
    });

    list.appendChild(item);
  });
}

/**
 * Abre el modal para crear (sin id) o editar (con id).
 * @param {string|null} taskId
 */
function openTaskModal(taskId) {
  const modal = document.getElementById("task-modal");
  const task = taskState.items.find(function (item) {
    return item.id === taskId;
  });

  document.getElementById("modal-title").textContent = task ? "Editar tarea" : "Nueva tarea";
  document.getElementById("task-id").value = task ? task.id : "";
  document.getElementById("task-title").value = task ? task.title : "";
  document.getElementById("task-description").value = task ? task.description : "";
  document.getElementById("task-status").value = task ? task.status : "pending";
  document.getElementById("task-error").hidden = true;
  modal.showModal();
}

/**
 * Cierra el modal de tarea sin guardar.
 */
function closeTaskModal() {
  document.getElementById("task-modal").close();
  document.getElementById("form-task").reset();
}

/**
 * Crea o actualiza una tarea a partir del formulario.
 * @param {SubmitEvent} event
 */
function saveTask(event) {
  event.preventDefault();
  const id = document.getElementById("task-id").value;
  const title = document.getElementById("task-title").value.trim();
  const description = document.getElementById("task-description").value.trim();
  const status = document.getElementById("task-status").value;
  const errorBox = document.getElementById("task-error");

  if (!title) {
    errorBox.hidden = false;
    errorBox.textContent = "El título es obligatorio.";
    return;
  }

  if (id) {
    taskState.items = taskState.items.map(function (task) {
      if (task.id !== id) {
        return task;
      }
      return { id: task.id, title: title, description: description, status: status };
    });
  } else {
    taskState.items.unshift({
      id: createTaskId(),
      title: title,
      description: description,
      status: status,
    });
  }

  closeTaskModal();
  renderTasks();
}

/**
 * Elimina una tarea de la lista local.
 * @param {string} taskId
 */
function deleteTask(taskId) {
  const confirmed = window.confirm("¿Eliminar esta tarea?");
  if (!confirmed) {
    return;
  }
  taskState.items = taskState.items.filter(function (task) {
    return task.id !== taskId;
  });
  renderTasks();
}

/**
 * Cambia el filtro de la barra (todas, pendientes, completadas).
 * @param {string} filter
 */
function setTaskFilter(filter) {
  taskState.filter = filter;
  document.querySelectorAll(".chip").forEach(function (chip) {
    chip.classList.toggle("is-active", chip.dataset.filter === filter);
  });
  renderTasks();
}

/**
 * Enlaza botones, filtros y el modal al cargar la página.
 */
function initTasks() {
  document.getElementById("btn-new-task").addEventListener("click", function () {
    openTaskModal(null);
  });
  document.getElementById("btn-cancel-task").addEventListener("click", closeTaskModal);
  document.getElementById("form-task").addEventListener("submit", saveTask);
  document.querySelectorAll(".chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      setTaskFilter(chip.dataset.filter);
    });
  });
}

document.addEventListener("DOMContentLoaded", initTasks);
