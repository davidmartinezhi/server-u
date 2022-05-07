const express = require("express");
const PostController = require("../controllers/post");
const md_auth = require("../middlewares/authenticated");
const api = express.Router(); //Inicializamos las rutas


api.post("/add-post", [md_auth.ensureAuth], PostController.addPost);
api.get("/get-posts", PostController.getPost);

module.exports = api;