const express = require("express");
const UserController = require("../controllers/user");
const multipart = require("connect-multiparty");

const md_auth = require("../middlewares/authenticated");
const md_upload_avatar = multipart( {uploadDir: "./uploads/avatar" });

const api = express.Router();

//End point de tipo post, le doy una ruta y su función
//Cuando se haga un post a esa ruta, se ejecuta la función
api.post("/sign-up", UserController.signUp);    //Se va a ejecutar esa función

//creando otra ruta
api.post("/sign-in", UserController.signIn);

//Creando endpoint de tipo GET
api.get("/users", [md_auth.ensureAuth], UserController.getUsers);
api.get("/users-active", [md_auth.ensureAuth], UserController.getUsersActive);

//Ruta para subir avatar
api.put("/upload-avatar/:id", [md_auth.ensureAuth, md_upload_avatar], UserController.uploadAvatar);
module.exports = api;

