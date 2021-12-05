//el usuario va poder acceder a url donde se puede autenticar por ejemplo /login, /singin, /singup

const express = require('express'); //requiero express para crear rutas y lo guardo en una variable del mismo nombre
const router = express.Router();//utilizo express para llamar al metodo Router permite tener un objeto que puede facilitar la creacion de rutas

const User = require('../models/User'); //requiero el archivo User, y se guarda en una variable User que es el modelo de datos

const passport = require('passport'); //requiero passport y lo guardo en una constante passport para usar la estrategia de autenticacion

router.get('/users/signin', (req, res) => { //Ruta para que el usuario pueda ingresar a la pagina
 res.render('users/signin') //Renderiza o envia el archivo signin para ingresar
});

router.post('/users/signin', passport.authenticate('local', { //desde /users/signin a travez de post trata de autenticar al usuario a travez de local
    successRedirect: '/notes', //si el usuario y contraseña es correcto se va a redireccionar a las notas
    failureRedirect: '/users/signin', //si el usuario inserta un usuario y contraseña mal se redirecciona a iniciar sesion
    failureFlash: true //manda mensajes de flash
}));

router.get('/users/signup', (req, res) => { //Ruta para que el usuario pueda registrarse
    res.render('users/signup') //Renderiza o envia el archivo signup para que el archivo pueda registrarse
});

router.post('/users/signup', async (req, res) => { //ruta para recibir los datos del registro
    const { name, email, password, confirm_password } = req.body; //Desde req.body se tilizan los datos name, email, password, confirm_password y se guardan en una constante por separado
    const errors = []; //Arreglo que almacena errores
    if (name.length <= 0) { //Si el nombre es menor a cero 
        errors.push({text: 'Ingresa Tu Nombre'}) //Guarda el error en el arreglo y envia un mensaje
    }
    if (password != confirm_password) { //si password es distinta de confirm_password
        errors.push({text: 'Las contraseñas no coinciden'}) //Guarda el error en el arreglo y envia el mensaje Las contraseñas no coinciden
    }
    if (password.length < 4) { //si la contraseña es menor a 4 digitos
        errors.push({text: 'La Contraseña Debe Ser Al Menos De 4 Caracteres'}) //Guarda el error rn el arreglo y envia un mensaje
    }
    if (errors.length > 0) { //si existen errores en el arreglo, 
        res.render('users/signup', {errors, name, email, password, confirm_password}); //renderiza la vista signup pero con los errores
    } else { //Si no hay errores
        const emailUser = await User.findOne({email: email});  //busca un dato por el correo que esta pasando el usuario una vez que termine de buscar el dato retorna el correo del usuario
        if(emailUser) { //si se ha encontrado una coincidencia con el correo 
            req.flash('errors_msg', 'El Email Ya Esta Registrado'); //envia un mensaje de flash de error 
            res.redirect('/users/signup'); //se redirecciona a la misma vista signup
        } else {
            const newUser = new User({name, email, password}); //utiliza el modelo de datos para guardar un dato nuevo, con lo datos name, email, password
        newUser.password = await newUser.encryptPassword(password); //reemplaza la contraseña por la contraseña cifrada antes de guardar el nuevo usuario
        await newUser.save() //el nuevo usuario se va a guardar en la base de datos
        req.flash('success_msg', 'Estas Registrado') //una vez guardado envia un mensaje flash success_msg
        res.redirect('/users/signin') //redirecciona al inicio de sesion
        }
    }
});

router.get('/users/logout', (req, res) => { //cuando pida la ruta /users/logout
    req.logout(); //utiliza un metodo de passport para terminar la sesion
    res.redirect('/'); //redirecciona a la pagina princiapl
});

module.exports = router; //necesito exportar