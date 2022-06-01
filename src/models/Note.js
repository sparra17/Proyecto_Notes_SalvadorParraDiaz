//Modelo de datos para notas

const mongoose = require('mongoose'); //requiero mongoose para crear esquemas de datos
const { Schema } = mongoose; //desde mongoose requiero solo el esquema y guarda en una constante para poder utilizarlo

const NoteSchema = new Schema({ //Nuevo esquema para definir como van a lucir las notas, guarda en una variable NoteSchema
    title: {type: String, required: true}, //Propiedad titulo que es requerido
    description: {type: String, required: true}, // Propiedad descripcion que es requerido
    date: {type: String, required: true}, //Propiedad fecha de creacion de la nota, fecha acual
    user: {type: String} //propiedad user para almacenar el id de cada usuario, cuando se crea una nota nueva
});

module.exports = mongoose.model('Note', NoteSchema) /*Para utilizar el modelo de datos en otra parte del 
codigo, utliza desde mongoose el modelo que usa dos parametros la nota y el esquema*/