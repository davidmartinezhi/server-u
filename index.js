const mongoose = require("mongoose"); //importado mongoose
const app = require("./app"); //importado app
const port = process.allowedNodeEnvironmentFlags.PORT || 3977;  //Puerto de nuestra aplicación
const { API_VERSION, IP_SERVER, PORT_DB } = require("./config");

//Conexión a base de datos
mongoose.connect(`mongodb://${IP_SERVER}:${PORT_DB}/davidgerardomartinez`);
