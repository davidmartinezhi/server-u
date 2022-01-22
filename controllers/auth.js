const jwt = require("../services/jwt");
const moment = require("moment");
const user = require("../models/user");

//Checar fecha de expiración también en server para mayor seguridad
function willExpireToken( token ) {
    const {exp} = jwt.decodedToken(token);
    const currentDate = moment.unix();

    if(currentDate > exp){
        return true;
    }

    return false;
}

//refreshAccessToken
function refreshAccessToken(req, res){
    console.log("Estamos refrecando el access token.");
}

module.exports = {
    refreshAccessToken
}