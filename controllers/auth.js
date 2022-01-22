const jwt = require("../services/jwt");
const moment = require("moment");
const User = require("../models/user");
const { use } = require("../routers/auth");

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
    
    const {refreshToken} = req.body;    //Guarda el Token que viene en el body
    
    const isTokenExpired = willExpireToken(refreshToken);

    if(isTokenExpired){
        res.status(404).send({message: "Refresh Token ha expirado."});
    }
    else{
        const { id } = jwt.decodedToken(refreshToken);

        use.findOne({_id: id}, (err, userStored) => {
            if(err){
                res.status(500).send({message: "Error del servidor."});
            }
            else{
                if(!userStored){
                    res.status(404).send({message:"Usuario no encontado"});
                }
                else{
                    res.status(200).send({
                        accessToken: jwt.createAccessToken(userStored),
                        refreshToken: refreshToken
                    });
                }
            }
        });
    }
}

module.exports = {
    refreshAccessToken
}