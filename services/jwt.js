const jwt = require("jwt-simple");
const moment = require("moment");

//Aquí genero clave secreta que solo debo de ver yo
const SECRET_KEY = "gR7cH9Svfj8JLe4c186Ghs48hheb3902nh5DsA";


function createAccessToken(user) {
  //Aquí no se pone la contraseña del token, porque esto no es privado
  const payload = {
    id: user._id,
    name: user.name,
    lastname: user.lastname,
    email: user.email,
    roll: user.roll,
    createToken: moment().unix(), //Nos lo da en formato unix el momento actual, timestamp en segundos
    exp: moment().add(3, "hours").unix(), //Le agrega 3 horas al momento actual en timestamp de segundos
  };

  //jwt.encode lo utilizamos para codificar el payload y la clave secreta
  return jwt.encode(payload, SECRET_KEY);
}

module.exports = {
    createAccessToken,
}