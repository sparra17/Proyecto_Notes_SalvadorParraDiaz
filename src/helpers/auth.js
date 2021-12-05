//crea un helper

const helpers = {}; //crea un helpers

helpers.isAuthenticated = (req, res, next) => { //es un bojeto con un metodo llamado isAuthenticate para comprobar si el usuario esta autenticado
    if(req.isAuthenticated()) { //si req.isAuthenticated, si el usuario esta logueado devuelve un true
        return next(); //si esta logueado, continua con la siguente funcion
    }
    req.flash('error_msg', 'No Autorizado'); //si no esta logueado envia un error 
    res.redirect('/users/signin') //redirecciona a una ventana de logueo
};

module.exports = helpers; ///para poder utilizar el modelo en otra poarte del codigo