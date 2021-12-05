//Esquema para guardar los usuarios

const mongoose = require ('mongoose'); //requiero el modulo mongoose y se guarda en una constante llamada mongoose
const { Schema } = mongoose; //Del modulo mongoose requiero solo el esquema
const bcrypt = require('bcryptjs'); //requiero bcrypt y se guarda en una constante del mismo nombre

const UserSchema = new Schema({ //Crea un nuevo esquema y lo guarda en UserSchema para poderlo utilizar
    name: {type: String, required: true }, //El esquema debe tener un nombre
    email: {type: String , required: true}, //El esquema debe tener un email
    password: {type: String, required: true}, //El esquema debe tener una contraseña
    date: {type: Date, default: Date.now} //El esquema debe tener una fecha asignada automaticamente
});

UserSchema.methods.encryptPassword = async (password) => { //metodo que recibe la contraseña para cifrarla de forma asincrona
    const salt = await bcrypt.genSalt(10); //genera un hash y aplica 10 veces el algoritmo y devuelve el hash 
    const hash = bcrypt.hash(password, salt); //cifra la contraseña
    return hash; //retorna la contraseña cifrada
};

UserSchema.methods.matchPassword = async function (password) { //toma la contraseña y la compara con la de la base de datos
    return await bcrypt.compare(password, this.password); //retorna true si la comparacion de la contraseña es correcta 
};

module.exports = mongoose.model('User', UserSchema); /*Para utilizar el modelo de datos en otra parte del 
codigo, utliza desde mongoose un modelo que usa dos parametros el nombre del modelo y el esquema*/