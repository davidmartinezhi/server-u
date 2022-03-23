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

    Menu.find().then((menus) => {
        if(!menus){
            res.status(404).send({message: "No se ha encontrado ningún menú"});
        }
        else{
            res.status(200).send({menus});
        }
    });
}

module.exports = {
  addMenu,
  getMenus
};
