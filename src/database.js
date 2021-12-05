//Archivo para tener una conexion a una base de datos

const mongoose = require('mongoose'); //requiero mongoose y lo guardo en una variable del mismo nombre

mongoose.connect('mongodb://mongo/notasdb') //se va a conectar a la base de datos llamada notasdb
  .then(db => console.log('Base de datos conectada', db.connection.host)) //si se conecta exitosamente muestra mensaje
  .catch(err => console.error(err)); //si no se conecta muestra error