const express = require("express");
const Joi = require("@hapi/joi");

const ruta = express.Router();

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

ruta.get("/", (req, res) => {
  res.send(usuarios);
});

//Manejo de peticiones  con HTTP
ruta.get("/:id", (req, res) => {
  let usuario = existeUsuario(req.params.id);
  if (!usuario) {
    res.status(404).send("Usuario no encontrado");
  }

  res.send(usuario);
});

//Manejo de peticiones Post
ruta.post("/", (req, res) => {
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
ruta.put("/:id", (req, res) => {
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

ruta.delete("/:id", (req, res) => {
  let usuario = existeUsuario(req.params.id);
  if (!usuario) {
    res.status(404).send("Usuario no encontrado");
    return;
  }

  const index = usuarios.indexOf(usuario);
  usuarios.splice(index, 1);

  res.send(usuario);
});

/**funciones para validar */
function existeUsuario(id) {
  return usuarios.find((u) => u.id === parseInt(id));
}

function validarUsuario(nom) {
  const schema = Joi.object({
    nombre: Joi.string().min(3).required(),
  });

  return schema.validate({ nombre: nom });
}

module.exports = ruta;
