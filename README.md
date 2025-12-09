# Manual de Ejecución
## Requisitos Previos

Base de Datos: Oracle Database Express Edition (XE) 19c.

Gestión de BD: SQL Developer (para ejecutar scripts y verificar tablas).

Entorno de Ejecución: Node.js.

## Configuración de la Base de Datos

Navega a la carpeta del backend: backend/src/config/

Abre el archivo db.js.

Modifica los parámetros con tu usuario y contraseña locales de Oracle

## Cómo Ejecutar el Proyecto

El proyecto se divide en dos terminales independientes: una para el servidor (Backend) y otra para la interfaz (Frontend).

### Paso 1: Levantar el Backend (Servidor)

Abre tu primera terminal y ejecuta:

cd backend

node index.js

Deberías ver un mensaje indicando que el servidor está corriendo (ej. en puerto 3000).



### Paso 2: Levantar el Frontend (Cliente)

Abre una segunda terminal y ejecuta:

cd frontend

npm run dev

Esto iniciará el entorno de desarrollo y te mostrará la URL local (ej. http://localhost:5173) para acceder desde el navegador.


## Vista General de Carpetas


### Frontend

Carpeta que contiene la interfaz de usuario desarrollada en React.


src/pages/: Contiene las vistas principales de la aplicación.

Páginas Generales: Vistas accesibles para todos los usuarios (Home, Catálogo, Login, etc.).

admin/: Subcarpeta que contiene las vistas exclusivas para el rol de Administrador (Gestión de presets, lista de pedidos).



###  Backend

Carpeta que contiene la lógica del servidor, API y conexión a datos.


src/config/: Archivos de configuración global, incluyendo la conexión a la base de datos (db.js) y configuraciones para manejo de imágenes.

src/models/: Capa de acceso a datos. Aquí se encuentran las consultas SQL directas a Oracle Database.

src/controllers/: Estos archivos reciben las peticiones desde las rutas, procesan y validan los datos, llaman a las funciones de los models y devuelven las respuestas.

src/routes/: Define los puntos de entrada de la API y los conecta con su controlador correspondiente.

src/public/uploads/presets: Contiene la imagen de los presets creados.

src/public/uploads/custom: Contiene la imagen de los pedidos custom solicitados


src/controllers/: Recibe las peticiones de las rutas, procesa la información y se comunica con los models para obtener o guardar datos.
