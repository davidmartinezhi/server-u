const express = require("express");
const MenuController = require("../controllers/menu");
const md_auth = require("../middlewares/authenticated");


//Inicío la api con express
const api = express.Router();

api.post("/add-menu", [md_auth.ensureAuth], MenuController.addMenu);

//Todas las rutas se exportan automaticamente, de esta manera
module.exports = api;
