const jwt = require("jwt-simple");
const moment = require("moment");

//Aquí genero clave secreta que solo debo de ver yo
const SECRET_KEY = "gR7cH9Svfj8JLe4c186Ghs48hheb3902nh5DsA";

//Crea token de acceso
//Siempre que quiera acceder a la info del usuario, uso el access token
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

//Reinicia el access token, siempre y cuando el refreshToken este activo
function createRefreshToken(user){
    //Cuando intentemos refrescar el access token. 
    //Pasamos ambos token los decodificamos y checamos que los id sean correctors

    const payload = {
        id: user._id,   //Paso id de usuario
        exp: moment().add(30, "days").unix(),
    }

    return jwt.encode(payload, SECRET_KEY);
}

//jwt.io, pagina web para checar la codificación o decodificación
function decodedToken(token){
    return jwt.decode(token, SECRET_KEY, true);
}

module.exports = {
    createAccessToken,
    createRefreshToken,
    decodedToken
}