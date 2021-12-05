//Para autenticar el usuario

const passport = require('passport'); //requiero passport y se guarad en una variable del mismo nombre
const LocalStrategy = require('passport-local').Strategy; //requiero el modulo passport-local del cual solo se requiere la estrategia de autentificacion y se guarda en una constante LocalStrategy

const User = require('../models/User') //requiero el modelo User

passport.use(new LocalStrategy({ //Define una nueva estrategia  de autenticacion con los siguientes parametros
    usernameField: 'email' //el susuario se va a autenticar a travez del correo
}, async (email, password, done) => { //funcion para validar, recibe email, password y done para terminar con la autenticacion
    const user = await User.findOne({email: email}); //del modelo de datos quiero buscar el correo que esta ingresando el usuario, devuelve el correo
    if(!user) { //si no existe un usuario en la base de datos 
        return done(null, false, {message: 'Usuarion No Encontrado'}); //retorna un mensaje
    } else { //si existe un usuario en la base de datos
        const match = await user.matchPassword(password); //valida la contraseñacon el el metodo matchPassword, retorna si la contraseña es igual
        if(match){ //si match es verdad, si las contraseñas coinciden
            return done(null, user); //retorna null para error y el usuario que esta encontrando
    } else { //si match es falso
        return done(null, false, {message: 'Contraseña incorrecta'}); //retorna un mensaje de contraseña incorrecta
    }
}
}));

passport.serializeUser((user, done) => { //toma el usuario para almacenarlo en una sesion
    done(null, user.id); /*ejcuta el callback con un error null  y con un usuario.id, cuando el usuario se 
    autentique se va a almacenar el id en una sesion para que no sea necesario volver a autenticarse */
});

passport.deserializeUser((id, done) => { //si hay un usuario en sesion toma el id y un callback
    User.findById(id, (err, user) => { //realiza una busqueda a la base de datos de y toma el id del usuario, puede haber un error o encontrarlo
        done(err, user); //si hay un error lo devuelve y si encontro el usuario lo devuelve
    });
});