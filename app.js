const express = require("express");
const bodyParser = require("body-parser");

const app = express();  //Iniciacion de express
const { API_VERSION } = require("./config");

//Load routings
//...

//Configuracion de bodyParser en express
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());

//Configure header HTTP

//Router basic
//...

module.exports = app;