/**
//modulo de gestion
 * Gestiona el listado y el formulario de tareas.
 * Las tareas se leen y se guardan en la tabla "tasks" de Supabase.
 * Gracias a las políticas RLS, cada usuario solo ve y modifica las suyas.
 */
const taskState = {
  items: [],
  filter: "all",
};

/**
 * Descarga de Supabase las tareas del usuario con sesión iniciada
 * y vuelve a pintar la lista.
 */
async function loadTasks() {
  const client = getSupabaseClient();
  if (!client) {
    return;
  }

  const { data, error } = await client
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    window.alert("No se pudieron cargar las tareas: " + error.message);
    return;
  }

  taskState.items = data;
  renderTasks();
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
  document.getElementById("task-description").value = task ? task.description || "" : "";
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
 * Crea o actualiza una tarea en Supabase a partir del formulario.
 * @param {SubmitEvent} event
 */
async function saveTask(event) {
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

  const client = getSupabaseClient();
  if (!client) {
    errorBox.hidden = false;
    errorBox.textContent = "No hay conexión con Supabase.";
    return;
  }

  let result;
  if (id) {
    result = await client
      .from("tasks")
      .update({ title: title, description: description, status: status })
      .eq("id", id);
  } else {
    result = await client
      .from("tasks")
      .insert({ title: title, description: description, status: status });
  }

  if (result.error) {
    errorBox.hidden = false;
    errorBox.textContent = "No se pudo guardar: " + result.error.message;
    return;
  }

  closeTaskModal();
  loadTasks();
}

/**
 * Elimina una tarea de Supabase después de pedir confirmación.
 * @param {string} taskId
 */
async function deleteTask(taskId) {
  const confirmed = window.confirm("¿Eliminar esta tarea?");
  if (!confirmed) {
    return;
  }

  const client = getSupabaseClient();
  if (!client) {
    return;
  }

  const { error } = await client.from("tasks").delete().eq("id", taskId);
  if (error) {
    window.alert("No se pudo eliminar: " + error.message);
    return;
  }
  loadTasks();
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
