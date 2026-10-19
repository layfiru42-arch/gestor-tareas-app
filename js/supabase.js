/**
 * Configuración de Supabase.
 * La URL y la clave publishable son públicas por diseño: la seguridad real
 * la dan las políticas RLS de la tabla tasks. Nunca pongas aquí la clave
 * secret ni la service_role.
 */
const SUPABASE_CONFIG = {
  url: "https://oidezzllleldjpdyvtye.supabase.co",
  anonKey: "sb_publishable_raL5PDACokvnoiGXPvf8dw_gNS43GRz",
};

/** Cliente único de Supabase, se crea la primera vez que se necesita. */
let supabaseClient = null;

/**
 * Devuelve el cliente de Supabase, creándolo si todavía no existe.
 * Retorna null si falta la configuración o si la librería no está cargada
 * en index.html.
 * @returns {object|null} Cliente de Supabase o null.
 */
function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient;
  }
  if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
    return null;
  }
  if (!window.supabase || typeof window.supabase.createClient !== "function") {
    return null;
  }

  supabaseClient = window.supabase.createClient(
    SUPABASE_CONFIG.url,
    SUPABASE_CONFIG.anonKey
  );
  return supabaseClient;
}

/**
 * Indica si la app ya puede hablar con Supabase.
 * @returns {boolean}
 */
function isSupabaseReady() {
  return getSupabaseClient() !== null;
}