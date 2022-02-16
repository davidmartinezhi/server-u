const fs = require("fs");
const path = require("path");
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
                //Confirmamos que el usuario existe

                let user = userData;

                //Recuperamos la imagen que le hemos enviado
                if(req.files){  //Si llega un file
                    let filePath = req.files.avatar.path;   //Agarra la url de la imagen
                    let fileSplit = filePath.split("/");  //Lo convierte en un vector separado en "/"
                    let fileName = fileSplit[2];    //Agarramos el nombre de la imagen

                    //Separamos el nombre de la imagen con su tipo de archivo en el punto
                    let extSplit = fileName.split("."); 

                    let fileExt = extSplit[1]; //.jpg .png . jpeg

                    //Checamos que la extensión es correcta
                    if (
                      fileExt !== "png" &&
                      fileExt !== "jpg" &&
                      fileExt !== "jpeg"
                    ) {
                      res
                        .status(400)
                        .send({
                          message:
                            "La extensión de la imagen no es valida. (Extensiones validas: jpg, jpeg, png)",
                        });
                    } else {
                      //La variable user ahora tiene el nombre de la imagen
                      user.avatar = fileName;

                      User.findByIdAndUpdate(
                        { _id: params.id },
                        user,
                        (err, userResult) => {
                          //Actualiza los datos del id, con los datos que tenga user
                          if (err) {
                            res
                              .status(500)
                              .send({ message: "Error del servidor." });
                          } else {
                            if (!userResult) {
                              //Comprobamos otra vez que el id existe
                              res
                                .status(404)
                                .send({
                                  message: "No se ha encontrado el usuario.",
                                });
                            } else {
                              //Mando el resultado
                              //El front va a recibir el nombre del avatar como respuesta
                              res.status(200).send({ avatarName: fileName });
                            }
                          }
                        }
                      );
                    }
                }
            }
        }
    });
    
}

//Obtener avatar del servidor
function getAvatar( req, res){
    const avatarName = req.params.avatarName;
    const filePath = "./uploads/avatar/" + avatarName;

    fs.exists(filePath, exists => {
        if(!exists){
            res.status(404).send({message: "El avatar que buscas no existe."});
        } else{
            res.sendFile(path.resolve(filePath));
        }
    });
}


//Actualiza datos del usuario en la base de datos
async function updateUser( req, res){
    
    //Mandamos los datos del usuario mediante el body
    var userData = req.body;
    userData.email = req.body.email.toLowerCase();  //Convierto nuevo email a lowercase
    const params = req.params;

    //Si nos llega la contraseña del usuario
    if(userData.password){
        //Esperamos a que se termine de encriptar la password antes de proseguir con el resto del codigo
        //También por eso uso el async antes de la función
        await bcrypt.hash(userData.password, null, null, (err, hash) => {

            if(err){
                res.status(500).send({message: "Error al encriptar la constraseña."});
            }
            else{
                userData.password = hash; //Actualizamos la password con la constraseña encriptada
            }
        });
    }

    User.findByIdAndUpdate( {_id: params.id}, userData, (err, userUpdate) => {
        //Actualiza los datos que vienen en userUpdate
        //Cuando llega al id, si encuentra la key la actualiza, sino la crra
        if(err){
            res.status(500).send({message: "Error del servidor."});
        }
        else{
            if(!userUpdate){
                res.status(404).send({message: "No se ha encontrado ningún usuario."});
            }
            else{
                res.status(200).send({message: "Usuario actualizado correctamente."});
            }
        }
    });
}

//Activa y Desactiva usuarios
function activateUser( req, res) {
    //Por los parametros me llega el id del usuario, siento que se pone el id en la parte client
    const { id } = req.params;
    const { active } = req.body;

    //Por tener el mismo nombre que en la base de datos, se escribe {active} si fuera otro valor
    //Se escribe como {active: variable del destructuring req.body}
    //Diciendo ahí mismo, este id, cambiale este valor por este otro y la función checa como tratar si fue exitoso o no el proceso para avisar al front-end
    User.findByIdAndUpdate(id, {active}, (err, userStored) => {
        if(err){
            res.status(500).send({message: "Error del servidor."});
        }
        else{

            if(!userStored){    //User no encontrado
                res.status(404).send({message: "No se ha encontrado el usuario."});
            }
            else {  //Usuario encontrado

                if(active === true){    //Se quiere activar el usuario
                    res.status(200).send({message: "Usuario activado correctamente."});
                }
                else{
                    res.status(200).send({message: "Usuario desactivado correctamente."});
                }
            }
        }
    });
    
}

module.exports = {
    signUp,
    signIn,
    getUsers,
    getUsersActive,
    uploadAvatar,
    getAvatar,
    updateUser,
    activateUser
};