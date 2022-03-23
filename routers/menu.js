const express = require("express");
const MenuController = require("../controllers/menu");
const md_auth = require("../middlewares/authenticated");


//Inicío la api con express
const api = express.Router();

//Crea menu en la base de datos
api.post("/add-menu", [md_auth.ensureAuth], MenuController.addMenu);

//Despliega menú desde la base de datos al front end
api.get("/menus", [md_auth.ensureAuth], MenuController.getMenus);


//Todas las rutas se exportan automaticamente, de esta manera
module.exports = api;
