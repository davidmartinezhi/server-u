Archivos y Carpetas
===================
  * Controllers: - contiene funciones con las que controlaremos el backend

  * Middleware: - Comprueba ejecuciones para permisos, urls y mas

  * Models: - Va a tener modelos (Objetos)

  * Routers: - Exporta rutas para que el dom pueda hacer peticiones al var.

  * Services: - Contiene los tokens, crea los tokens
    necesitamos access token y refresh token
    -jwt.js

  * Index.js: - Primer ejecutable

  * App.js: - Conexión con la base de datos

  * Config.js: - Guardar versiones y configuraciones

Dependencias
============
  * bcrypt-nodejs - Encripta contraseñas

  * body-parser - Pasar información en el body en las peticiones http, al usar express

  * connect-multiparty - Middleware para subir imagenes a nuestro servidor

  * express - Crear sistema de rutas

  * jwt-simple - Codificar y decodificar tokens

  * Moment - Para trabajar con fechar y horas

  * Mongoose - Generar esquemas y modelos

  * Nodemone - Reinicia el server de manera automatica para actualizar la pagina


  Comandos
  ========
  * Yarn start - para iniciar el servidor con nodemon index.js


Checar que la contraseña se guarde en la base de datos y encriptada. Al crear un usuario nuevo
 