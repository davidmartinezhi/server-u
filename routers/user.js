const express = require("express");
const UserController = require("../controllers/user");

const api = express.Router();

//End point de tipo post, le doy una ruta y su función
//Cuando se haga un post a esa ruta, se ejecuta la función
api.post("/sign-up", UserController.signUp);    //Se va a ejecutar esa función

module.exports = api;

