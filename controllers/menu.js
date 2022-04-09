const Menu = require("../models/menu");

function addMenu(req, res) {
  //Crea nuevos menus en la base de datos

  const { title, url, order, active } = req.body;

  //Creando modelo de menú vacío
  const menu = new Menu();

  //Rellenando el menu por lo recibido en el request
  menu.title = title;
  menu.url = url;
  menu.order = order;
  menu.active = active;

  //Guardar el menu
  menu.save((err, createMenu) => {
    if (err) {
      //Si no lo crea y marca error
      res.status(500).send({ message: "Error del servidor" });
    } else {
      if (!createMenu) {
        res.status(404).send({ message: "Error al crear el menú" });
      } else {
        res.status(200).send({ message: "Menú creado correctamente" });
      }
    }
  });
}

function getMenus(req, res) {
    //Exporta menus al front-end

    //Busca Menus
    Menu.find()
    .sort({order: "asc"})   //Lo orderna 
    .exec((err, menusStored) => {   //Ejecuta el result de menus
        if(err){    //Si hay algún error en el servidor
            res.status(500).send({message: "Error del servidor"});  //Marca error y manda el mensaje
        }
        else{   //Si no existe error por parte del servidor
            if(!menusStored){   //Si el menu regresado está vacío
                //Marcamos el error y regresamos el motivo del error
                res.status(404).send({message: "No se ha encontrado ningún elemento en el menú"});
            }
            else{   //Si no hay error el servidor y si hay menus en la base de datos
                res.status(200).send({menusStored});    //Los regresamos
            }
        }
    });
}

function updateMenu(req, res) {
  let menuData = req.body;
  const params = req.params;


  Menu.findByIdAndUpdate(params.id, menuData, (err, menuUpdate) => {
    if(err){
      res.status(500).send({message: "Error del servidor,"});
    }
    else{
      if(!menuUpdate){
        res.status(404).send({message: "No se ha encontrado ningún menú."});
      }else{
        res.status(200).send({message: "Menú actualizado correctamente."});
      }
    }
  });
}

//Se puede usar updateMenu, pero haré una nueva para poder practicar
function activateMenu(req, res) {
  const {id} = req.params; //Id del menú, nos dice que menú debemos de actualizar
  const {active} = req.body;  //El body dice si esta activo o no, es un boolean

  Menu.findByIdAndUpdate(id, {active}, (err, menuUpdated) => {
    if(err){
      res.status(500).send({message: "Error del servidor."}); 
    }
    else{
      if(!menuUpdated){
        res.status(404).send({message: "No se ha encontrado el menú,"});
      }
      else{
        if(active == true){
          res.status(200).send({message: "Menú Activado Correctamente."});
        }
        else{
          res.status(200).send({message: "Menú Desactivado Correctamente."});
        }
      }
    }
  });
}

//Eliminación de menús
function deleteMenu( req, res ){
  
  const {id} = req.params;

  Menu.findByIdAndRemove( id, (err, menuDeleted) => {
    if(err){  //Error
      res.status(500).send({message: "Error del servidor."});
    }
    else{
      if(!menuDeleted){ //Si no existé el menú
        res.status(404).send({message: "Menú no encontrado."});
      }
      else{ //Menú encontrado
        res.status(200).send({message: "Menú eliminado correctamente"});
      }
    }
  });
}

module.exports = {
  addMenu,
  getMenus,
  updateMenu,
  activateMenu,
  deleteMenu
};
