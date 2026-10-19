/**
 * Controla el registro, el inicio de sesión y el cierre de sesión
 * usando Supabase Auth. La sesión se restaura sola al recargar la página.
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
 * Valida un correo de forma básica.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Convierte el usuario de Supabase en el objeto simple que usa la interfaz.
 * @param {object} supabaseUser Usuario devuelto por Supabase Auth.
 * @returns {{id: string, email: string, name: string}}
 */
function buildUserFromSupabase(supabaseUser) {
  const metadata = supabaseUser.user_metadata || {};
  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    name: metadata.name || supabaseUser.email.split("@")[0],
  };
}

/**
 * Intercambia la vista de acceso por el tablero de tareas, o al revés.
 * Si hay sesión, pide las tareas del usuario a la base de datos.
 */
function renderAuthView() {
  const isLoggedIn = Boolean(authState.user);
  document.getElementById("auth-view").hidden = isLoggedIn;
  document.getElementById("app-view").hidden = !isLoggedIn;

  if (isLoggedIn) {
    document.getElementById("user-greeting").textContent =
      "Hola, " + (authState.user.name || authState.user.email);
    if (typeof loadTasks === "function") {
      loadTasks();
    }
  }
}

/**
 * Inicia sesión con correo y contraseña en Supabase.
 * @param {SubmitEvent} event
 */
async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  if (!isValidEmail(email) || password.length < 6) {
    setAuthError("login-error", "Revisa el correo y usa al menos 6 caracteres.");
    return;
  }

  const client = getSupabaseClient();
  if (!client) {
    setAuthError("login-error", "No se pudo conectar con Supabase. Recarga la página.");
    return;
  }

  setAuthError("login-error", "");
  const { data, error } = await client.auth.signInWithPassword({ email, password });

  if (error) {
    setAuthError("login-error", "No se pudo iniciar sesión: " + error.message);
    return;
  }

  authState.user = buildUserFromSupabase(data.user);
  renderAuthView();
}

/**
 * Registra una cuenta nueva en Supabase y guarda el nombre del usuario.
 * @param {SubmitEvent} event
 */
async function handleRegister(event) {
  event.preventDefault();
  const name = document.getElementById("register-name").value.trim();
  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value;

  if (!name || !isValidEmail(email) || password.length < 6) {
    setAuthError("register-error", "Completa nombre, correo válido y contraseña de 6+ caracteres.");
    return;
  }

  const client = getSupabaseClient();
  if (!client) {
    setAuthError("register-error", "No se pudo conectar con Supabase. Recarga la página.");
    return;
  }

  setAuthError("register-error", "");
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: { data: { name: name } },
  });

  if (error) {
    setAuthError("register-error", "No se pudo crear la cuenta: " + error.message);
    return;
  }

  if (data.session) {
    authState.user = buildUserFromSupabase(data.user);
    renderAuthView();
  } else {
    setAuthError("register-error", "Cuenta creada. Revisa tu correo para confirmarla y luego inicia sesión.");
  }
}

/**
 * Cierra la sesión en Supabase y vuelve a la pantalla de acceso.
 */
async function handleLogout() {
  const client = getSupabaseClient();
  if (client) {
    await client.auth.signOut();
  }
  authState.user = null;
  if (typeof taskState !== "undefined") {
    taskState.items = [];
  }
  document.getElementById("form-login").reset();
  document.getElementById("form-register").reset();
  showLoginForm();
  renderAuthView();
}

/**
 * Enlaza botones y formularios y recupera la sesión guardada, si existe.
 */
async function initAuth() {
  document.getElementById("tab-login").addEventListener("click", showLoginForm);
  document.getElementById("tab-register").addEventListener("click", showRegisterForm);
  document.getElementById("form-login").addEventListener("submit", handleLogin);
  document.getElementById("form-register").addEventListener("submit", handleRegister);
  document.getElementById("btn-logout").addEventListener("click", handleLogout);

  const client = getSupabaseClient();
  if (client) {
    const { data } = await client.auth.getSession();
    if (data.session) {
      authState.user = buildUserFromSupabase(data.session.user);
    }
  }
  renderAuthView();
}

document.addEventListener("DOMContentLoaded", initAuth);