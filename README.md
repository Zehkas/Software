# Integrantes
Sofia Espinosa

Benjamín Garrido

Mateo González

Vicente Herrera

Javier Cornejo

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


src/controllers/: Recibe las peticiones de las rutas, procesa la información y se comunica con los models para obtener o guardar datos.
