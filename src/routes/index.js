//irán las url de mi pagina principal ejemplo /about y cualquier ruta a la que cualquier persona pueda acceder
const express = require('express'); //requiero express para crear rutas y lo guardo en una variable del mismo nombre
const router = express.Router();//utilizo express para llamar al metodo Router permite tener un objeto que puede facilitar la creacion de rutas

router.get('/', (req, res) => { //cuando visiten la pagina principal va a manejarlo como un funcion que maneje las peticiones y las respuestas
    res.render('index'); //Renderiza o envia el archivo index.hbs en views
});

router.get('/about', (req, res) => { //crea una nueva ruta llamada about se va a manejar como un funcion que maneje las peticiones y las respuestas
    res.render('about') //Renderiza o envia el archivo about.hbs en views
});


module.exports = router; //necesito exportar router para poder utilizarlo en otra parte