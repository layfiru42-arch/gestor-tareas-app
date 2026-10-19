/**
 * Configuración futura de Supabase.
 * En esta etapa no se abre ninguna conexión real: solo se deja el esqueleto
 * para rellenar URL y clave anónima cuando el equipo active el backend.
 */
const SUPABASE_CONFIG = {
  url: "",
  anonKey: "",
};

/**
 * Devuelve el cliente de Supabase cuando exista configuración.
 * Hoy retorna null para que auth y tareas trabajen con datos locales de prueba.
 * @returns {object|null} Cliente o null si aún no hay credenciales.
 */
function getSupabaseClient() {
  if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
    return null;
  }

  // Más adelante: return supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
  return null;
}

/**
 * Indica si la app ya puede hablar con Supabase.
 * @returns {boolean}
 */
function isSupabaseReady() {
  return getSupabaseClient() !== null;
}
