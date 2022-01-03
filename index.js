const mongoose = require('mongoose'); //importado mongoose
const app = require("./app"); //importado app
const port = process.env.PORT || 3977;  //Puerto de nuestra aplicación
const { API_VERSION, IP_SERVER, PORT_DB } = require("./config");

//mongoose.set("useFindAndModify", false);

//Conexión a base de datos
mongoose.connect(
  `mongodb://${IP_SERVER}:${PORT_DB}/davidgerardomartinez`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, res) => {
    if (err) {
      throw err;
    } else {
      console.log("La conexión a la base de datos fue exitosa");

      app.listen(port, () => {
        console.log("#####################");
        console.log("##### API REST ######");
        console.log("#####################");
        console.log(`http://${IP_SERVER}:${port}/api/${API_VERSION}/`);
      });
    }
  }
);
