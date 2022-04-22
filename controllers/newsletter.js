const Newsletter = require("../models/newsletter");

//Subcribe a newsletter
function subscribeEmail(req, res) {
  //console.log(req.params);

  const email = req.params.email;

  const newsletter = new Newsletter();

  if (!email) {
    res.status(404).send({ code: 404, message: "El email es obligatorio." });
  } else {
    newsletter.email = email.toLowerCase();

    newsletter.save((err, newsletterStored) => {
      if (err) {
        res.status(500).send({ code: 500, message: "Email ya registrado." });
      } else {
        if (!newsletter) {
          res
            .status(404)
            .send({ code: 404, message: "Error al registrar correo." });
        } else {
          res
            .status(200)
            .send({ code: 200, message: "Email registrado correctamente." });
        }
      }
    });
  }
}

module.exports = {
  subscribeEmail,
};
