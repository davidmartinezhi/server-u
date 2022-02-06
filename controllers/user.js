const bcrypt = require("bcrypt-nodejs"); //Para encriptar constraseñas
const jwt = require("../services/jwt"); //Para Tokens
const User = require("../models/user"); //Modelo del usuario

//Crea/guarda nuevo usuario, siempre y cuando, no esten registrados
//Investigar los status en res.status
function signUp( req, res ){
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

//Verificar cuenta y dar acceso
function signIn( req, res ){
    const params = req.body; //Recibe los objetos que fueron mandados
    const email = params.email.toLowerCase();   //Recibo el mail y lo convierto a minusculas
    const password = params.password;

    //Busco un email que sea igual al que me acaban de mandar
    User.findOne({email}, (err, userStored) => { 
        //Si tenemos un error
        if(err){
            res.status(500).send({message:"Error del Servidor."});  //avisamos que fue error del servidor
        } else{
            //Si no existe el usuario
            if(!userStored){
                res.status(404).send({message: `El email ${email}, no esta registrado.`}); //aviso que el email no se encuentra en la base de datos
            } else{
                //userStored es el objeto usuario con todos los datos
                //Si el usuario existe, me devuelve el objeto con su información

                //Comparo contraseña encryptada con la no encryptada
                bcrypt.compare(password, userStored.password, (err, check) => {
                    //Checa si el servidor no regresa un error
                    if(err){
                        res.status(500).send({message: "Error del Servidor" });
                    } 
                    //Checa si la contraseña NO es correcta
                    else if(check === false){
                        res.status(404).send({message: "La contraseña es incorrecta."});
                    }
                    //La contraseña SI es correcta
                    else{
                        //Checo que el usuario esté activo
                        if(!userStored.active){
                            res
                            .status(200)
                            .send({code: 200, message: "El usuario no se ha activo." });    //Lo que va dentro del send, es lo que le mando al front-end
                        }
                        else{
                            //Si el usuario es correcto
                            //Mando el access token y el refresh token
                            res.status(200).send({
                                accessToken: jwt.createAccessToken(userStored),
                                refreshToken: jwt.createRefreshToken(userStored)
                            });
                        }
                    }
                });
            }    
        }
    });
}

//Exporta usuarios al front-end
function getUsers( req, res ){

    //Nos devuelve los usuarios
    User.find().then(users => {
        if(!users) {
            //Mando mensaje de que no fue encontrado nungún usuario
            res.status(404).send({message: "No se ha encontrado ningún usuario."});
        }
        else{
            //Regreso los usuarios
            res.status(200).send({users});
        }
    });
}

//Regresa usuarios activos
function getUsersActive( req, res ){
    const query = req.query;
    
    //Nos devuelve los usuarios
    User.find({ active: query.active }).then(users => {
        if(!users) {
            //Mando mensaje de que no fue encontrado nungún usuario
            res.status(404).send({message: "No se ha encontrado ningún usuario."});
        }
        else{
            //Regreso los usuarios
            res.status(200).send({users});
        }
    });
}

//Sube el avatar del usuario al servidos
function uploadAvatar( req, res ){
    //En params recibimos el ID del usuario
    const { params } = req;


    
    User.findById({ _id: params.id}, (err, userData) => {
        
        if(err){    //Error del servidor
            res.status(500).send({message: "Error del servidor."});
        }
        else{
            if(!userData) { //Error al encontrar el ID en usuarios
                res.status(404).send({ message: "No se ha encontrado ningún usuario."});
            }
            else{   //ID encontrado

                let user = userData;

                console.log(userData);
            }

        }
    });
    
}

//Obtener avatar del servidor

//Actualiza datos del usuario

module.exports = {
    signUp,
    signIn,
    getUsers,
    getUsersActive,
    uploadAvatar
};