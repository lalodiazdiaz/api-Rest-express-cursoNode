const debug = require("debug")("app:inicio");
//const dbDebug = require("debug")("app:db");
const express = require("express");
const Joi = require("@hapi/joi");
const config = require("config");

// const logger = require("./logger");
const morgan = require("morgan");
const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); //para archivos estaticos

// app.use(logger);
// app.use(function (req, res, next) {
//   console.log("Auntenticando....");
//   next();
// });

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

const usuarios = [
  {
    id: 1,
    nombre: "Eduardo",
  },
  {
    id: 2,
    nombre: "Alejandra",
  },
  {
    id: 3,
    nombre: "Either",
  },
];

app.get("/", (req, res) => {
  res.send("Either es puto");
}); //Peticion

app.get("/api/usuarios", (req, res) => {
  res.send(usuarios);
});

//Manejo de peticiones  con HTTP
app.get("/api/usuarios/:id", (req, res) => {
  let usuario = existeUsuario(req.params.id);
  if (!usuario) {
    res.status(404).send("Usuario no encontrado");
  }

  res.send(usuario);
});

//Manejo de peticiones Post
app.post("/api/usuarios/", (req, res) => {
  /**Valdacion usando JOI */

  const { error, value } = validarUsuario(req.body.nombre);

  if (!error) {
    const usuario = {
      id: usuarios.length + 1,
      nombre: value.nombre,
    };
    usuarios.push(usuario);
    res.send(usuario);
  } else {
    const msj = error.details[0].message;
    res.status(400).send(msj);
  }
});

//Metodo PUT
app.put("/api/usuarios/:id", (req, res) => {
  //Encontrar si existe el objeto a modificar
  let usuario = existeUsuario(req.params.id);
  // let usuario = usuarios.find((u) => u.id === parseInt(req.params.id));
  if (!usuario) {
    res.status(404).send("Usuario no encontrado");
    return;
  }
  const { error, value } = validarUsuario(req.body.nombre);

  if (error) {
    const msj = error.details[0].message;
    res.status(400).send(msj);
    return;
  }
  usuario.nombre = value.nombre;
  res.send(usuario);
});

// Metodo Delete

app.delete("/api/usuarios/:id", (req, res) => {
  let usuario = existeUsuario(req.params.id);
  if (!usuario) {
    res.status(404).send("Usuario no encontrado");
    return;
  }

  const index = usuarios.indexOf(usuario);
  usuarios.splice(index, 1);

  res.send(usuario);
});

//set PORT = 5000
const port = process.env.PORT || 3000; //pasando variable de entorno o iniciando en puerto 3000 si no existe variable

app.listen(port, () => {
  console.log(`Escuchando en el puerto ${port}`);
});

function existeUsuario(id) {
  return usuarios.find((u) => u.id === parseInt(id));
}

function validarUsuario(nom) {
  const schema = Joi.object({
    nombre: Joi.string().min(3).required(),
  });

  return schema.validate({ nombre: nom });
}
