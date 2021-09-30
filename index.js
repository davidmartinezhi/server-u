const mongoose = require("mongoose"); //importado mongoose
const app = require("./app"); //importado app
const port = process.allowedNodeEnvironmentFlags.PORT || 3977;  //Puerto de nuestra aplicación
const portDb = 27017; //Puerto de la base de datos
const { API_VERSION, IP_SERVER } = require("./config");

//Conexión a base de datos
mongoose.connect(`mongodb://`);
