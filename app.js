const debug = require("debug")("app:inicio");
//const dbDebug = require("debug")("app:db");
const express = require("express");

const config = require("config");
const usuarios = require("./routes/usuarios");

// const logger = require("./logger");
const morgan = require("morgan");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); //para archivos estaticos
app.use("/api/usuarios", usuarios);

//Configuracion de entornos
console.log("Aplicaicon " + config.get("nombre"));
console.log("BD Server:" + config.get("configDB.host"));

/**uso de middleware terceros */
if (app.get("env") === "development") {
  app.use(morgan("tiny"));

  debug("Morgan esta habilitado");
}

// Tabajo con base de datos

debug("Conectando con la base de datos");

app.get("/", (req, res) => {
  res.send("Soy una verga");
}); //Peticion

//set PORT = 5000
const port = process.env.PORT || 3000; //pasando variable de entorno o iniciando en puerto 3000 si no existe variable

app.listen(port, () => {
  console.log(`Escuchando en el puerto ${port}`);
});
