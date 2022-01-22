const express = require("express");
const bodyParser = require("body-parser");

const app = express();  //Iniciacion de express
const { API_VERSION } = require("./config");

//Load routings
const authRoutes = require("./routers/auth");
const userRoutes = require("./routers/user");

//Configuracion de bodyParser en express, investigar que es este codigo. Para que funciona
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Configure header HTTP

//Router basic
app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, userRoutes);

module.exports = app;