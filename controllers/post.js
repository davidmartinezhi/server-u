const Post = require("../models/post");

function addPost(req, res) {
  const body = req.body;
  const post = new Post(body);

  post.save((err, postStored) => {
    if (err) {
      res.status(500).send({ code: 500, message: "Error del servidor." });
    } else {
      if (!postStored) {
        res
          .status(400)
          .send({ cose: 400, message: "No se ha podido crear el post" });
      } else {
        res
          .status(200)
          .send({ code: 200, message: "Post creado correctamente" });
      }
    }
  });
}

function getPost(req, res) {
  const { page = 1, limit = 10 } = req.query; //Esto es vuando ponemos en el lin ?page=1&limit=10...

  const options = {
    page,
    limit: parseInt(limit), //Esto se usa para cuando debemos enviar entero
    sort: { date: "desc" },
  };

  Post.paginate({}, options, (err, postsStored) => {
    if (err) {
      res.status(500).send({ code: 500, message: "Error del servidor." });
    } else {
      if (!postsStored) {
        res
          .status(404)
          .send({ code: 404, message: "No se ha encontrado ningún post," });
      } else {
        res.status(200).send({ code: 200, posts: postsStored });
      }
    }
  });
}

module.exports = {
  addPost,
  getPost,
};
