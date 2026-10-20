# Bitácora: gestor de tareas

Aplicación web de gestión de tareas desarrollada para el Proyecto #2 de Entornos de Programación (Universidad de Panamá, Centro Regional Universitario de Coclé), usando Cursor como IDE con inteligencia artificial.

## Funciones

- Registro e inicio de sesión de usuarios
- Crear, editar y eliminar tareas
- Filtros por estado (todas, pendientes, completadas)
- Cada usuario ve únicamente sus propias tareas
- Diseño adaptable a móvil y escritorio

## Tecnologías

- HTML, CSS y JavaScript
- Supabase (autenticación y base de datos PostgreSQL)
- Git y GitHub
- Cursor (IDE con IA)

## Estructura del proyecto

- `index.html`: estructura de las pantallas
- `css/styles.css`: estilos y diseño responsive
- `js/supabase.js`: configuración del cliente de Supabase
- `js/auth.js`: registro, inicio y cierre de sesión
- `js/tasks.js`: crear, listar, editar, eliminar y filtrar tareas

## Base de datos

Tabla `tasks` con las columnas: `id`, `user_id`, `title`, `description`, `status` (pending o done) y `created_at`. La seguridad a nivel de fila (RLS) garantiza que cada usuario solo accede a sus tareas.

## Cómo ejecutarla

1. Clonar el repositorio: `git clone https://github.com/layfiru42-arch/gestor-tareas-app.git`
2. Abrir la carpeta en un editor y servir `index.html` con un servidor local (por ejemplo, la vista previa de Cursor o la extensión Live Server).
3. Crear una cuenta e iniciar sesión.

## Integrantes

- Joshua Moreno
- Elvis Castillo