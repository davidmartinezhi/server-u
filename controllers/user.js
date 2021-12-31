const bcrypt = require("bcrypt-nodejs"); //Para encriptar constraseñas
//const jwt = require(""); //Para Tokens
const User = require("../models/user"); //Modelo del usuario


function signUp( req, res){
    console.log('End Point de Sign Up');
}

module.exports = {
    signUp
};