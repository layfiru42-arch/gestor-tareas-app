/**
 * Controla las pantallas de registro e inicio de sesión.
 * Mientras Supabase no esté conectado, la sesión se simula en memoria
 * para poder revisar el diseño y el flujo de la interfaz.
 */
const authState = {
  user: null,
};

/**
 * Muestra el formulario de inicio de sesión y oculta el de registro.
 */
function showLoginForm() {
  document.getElementById("form-login").hidden = false;
  document.getElementById("form-register").hidden = true;
  document.getElementById("tab-login").classList.add("is-active");
  document.getElementById("tab-register").classList.remove("is-active");
  document.getElementById("tab-login").setAttribute("aria-selected", "true");
  document.getElementById("tab-register").setAttribute("aria-selected", "false");
}

/**
 * Muestra el formulario de registro y oculta el de inicio de sesión.
 */
function showRegisterForm() {
  document.getElementById("form-login").hidden = true;
  document.getElementById("form-register").hidden = false;
  document.getElementById("tab-register").classList.add("is-active");
  document.getElementById("tab-login").classList.remove("is-active");
  document.getElementById("tab-register").setAttribute("aria-selected", "true");
  document.getElementById("tab-login").setAttribute("aria-selected", "false");
}

/**
 * Escribe un mensaje de error debajo del formulario indicado.
 * @param {string} elementId Identificador del párrafo de error.
 * @param {string} message Texto a mostrar. Si está vacío, se oculta el aviso.
 */
function setAuthError(elementId, message) {
  const box = document.getElementById(elementId);
  box.hidden = !message;
  box.textContent = message;
}

/**
 * Valida un correo de forma básica (suficiente para la maqueta).
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Intercambia la vista de acceso por el tablero de tareas, o al revés.
 */
function renderAuthView() {
  const isLoggedIn = Boolean(authState.user);
  document.getElementById("auth-view").hidden = isLoggedIn;
  document.getElementById("app-view").hidden = !isLoggedIn;

  if (isLoggedIn) {
    document.getElementById("user-greeting").textContent =
      "Hola, " + (authState.user.name || authState.user.email);
    if (typeof renderTasks === "function") {
      renderTasks();
    }
  }
}

/**
 * Simula un inicio de sesión. Cuando exista Supabase, aquí irá signInWithPassword.
 * @param {SubmitEvent} event
 */
function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  if (!isValidEmail(email) || password.length < 6) {
    setAuthError("login-error", "Revisa el correo y usa al menos 6 caracteres.");
    return;
  }

  setAuthError("login-error", "");
  authState.user = { id: "local-user", email, name: email.split("@")[0] };
  renderAuthView();
}

/**
 * Simula un registro. Cuando exista Supabase, aquí irá signUp.
 * @param {SubmitEvent} event
 */
function handleRegister(event) {
  event.preventDefault();
  const name = document.getElementById("register-name").value.trim();
  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value;

  if (!name || !isValidEmail(email) || password.length < 6) {
    setAuthError("register-error", "Completa nombre, correo válido y contraseña de 6+ caracteres.");
    return;
  }

  setAuthError("register-error", "");
  authState.user = { id: "local-user", email, name };
  renderAuthView();
}

/**
 * Cierra la sesión simulada y vuelve a la pantalla de acceso.
 */
function handleLogout() {
  authState.user = null;
  document.getElementById("form-login").reset();
  document.getElementById("form-register").reset();
  showLoginForm();
  renderAuthView();
}

/**
 * Enlaza botones y formularios de autenticación al cargar la página.
 */
function initAuth() {
  document.getElementById("tab-login").addEventListener("click", showLoginForm);
  document.getElementById("tab-register").addEventListener("click", showRegisterForm);
  document.getElementById("form-login").addEventListener("submit", handleLogin);
  document.getElementById("form-register").addEventListener("submit", handleRegister);
  document.getElementById("btn-logout").addEventListener("click", handleLogout);
  renderAuthView();
}

document.addEventListener("DOMContentLoaded", initAuth);
