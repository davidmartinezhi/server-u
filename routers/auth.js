const express = require("express");
const AuthController = require("../controllers/auth");

//Para generar rutas
const api = express.Router();

api.post("/refresh-access-token", AuthController.refreshAccessToken);

module.exports = api;