const bcrypt = require("bcrypt-nodejs"); //Para encriptar constraseñas
//const jwt = require(""); //Para Tokens
const User = require("../models/user"); //Modelo del usuario

//Endpoint que crea/guarda nuevo usuario, siempre y cuando, no esten registrados
//Investigar significado de req y res.
//Investigar los status en res.status
function signUp( req, res){
    const user = new User();

    const { name, lastname, email, password, repeatPassword } = req.body;

    user.name = name;
    user.lastname = lastname;
    user.email = email.toLowerCase();   //Todos los correos serán tomados con lowercase
    user.role = "admin";
    user.active = false;

    if(!password || !repeatPassword){
        res.status(404).send({message: "Las contraseñas son obligatorias."});
    }
    else{
        
        if(password != repeatPassword){
            res.status(404).send({message: "Las contraseñas no coinciden."});
        }
        else {
            bcrypt.hash(password, null, null, function(err, hash) {
                if(err){
                    res.status(500).send({message: "Error al encriptar la contraseña."});
                }
                else{
                    user.password = hash; //hash es la contraseña encriptada

                    //Guardando el usuario en la base de datos mongodb
                    user.save((err, userStored) => {
                        //Si hay algún error, nos avisa
                        if(err){
                            res.status(500).send({message: "El usuario ya existe"});
                        }
                        else{
                            //Si el usuario guardado es nulo, nos avisa
                            if(!userStored){
                                res.status(404).send({message: "Error al crear el usuario"});
                            }
                            //Si se guardo con exito el usuario, se guarda
                            else{
                                res.status(200).send({user: userStored});
                            }
                        }
                    });
                }
            });
        }
    }
}

module.exports = {
    signUp
};