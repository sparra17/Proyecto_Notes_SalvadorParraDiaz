//Archivo para arrancar el servidor, es el archivo principal

const express = require('express'); //requiero expres y lo guardo en una variable del mismo nombre
const path = require('path'); //requiero el modulo path que es un modulo de node y lo guardo en una variable del mismo nombre
const exphbs = require('express-handlebars'); //requiero express-handlebars que me permite terner el motor de plantillas y lo guardo en una variable exphbs
const methodOverride = require('method-override'); //requiero methodOverride y lo guardo en una variable del mismo nombre
const session = require('express-session'); // guardar los datos de los usuarios a traves de una sesion
const flash = require('connect-flash'); //vamos a poder mandar mensaje entre multiples vistas
const { create } = require('express-handlebars')
const Handlebars = require('handlebars');
const passport = require('passport') //requiero passport y se guarda en una constante del mismo nombre

//Inicializaciones
const app = express(); //devuelve un objeto que se almacena en una constante app
require('./database'); //utizamos la cadena de coneccion con la base de datos
require('./config/passport'); //requiero el archivo passport para utilizar la autenticacion

//Todas las configuraciones
app.set('port', process.env.PORT || 3000);  //crea una comfiguracion del puerto, si existe un puerto en mi computador lo tomara si no existe utilizara el numero 3000
app.set('views', path.join(__dirname, 'views')); //sirve para decirle a node que la carpera views esta en src, path.join para unir directorios, _dirname devuelve la carpera src
const hbs = create ({ //configuracion de handlebars, ejecuta la funcion y adentro le da un objeto de configuracion
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),   //Direccion de la carpeta layouts
    partialsDir: path.join(app.get('views'),'partials'),  //Direccion de la carpeta partials que son pequeñas partes de html que se pueden reutilizar en cualquier vista
    extname: 'hbs'    //colocar que extencion van a tener los archivos en este caso hbs
})    //Termina la configuracion
app.engine('hbs',hbs.engine);
app.set('view engine', 'hbs'); //utiliza la configuracion para configurar el motor de las vistas

//Middlewares: funciones que se ejecuntan antes que llegen al servidor
app.use(express.urlencoded({extended: false})); //Cuando un formulario envia determinado dato se pueda entender, extended: false solo para recibir datos no imagenes
app.use(methodOverride('_method')); //utiliza la funcion llamada methodOverride, a travez de que propiedad los formularios van a enviar otros tipos de metodos
app.use(session({   //utiliza el midleware llamado session y se configura como un objeto
    secret: 'misecreto', //se coloca la palabra secreta
    resave: true,
    saveUninitialized: true
}));  //con estas configuraciones basicas nos va a permitir poder autenticar el usuario y almacenar esos datos
app.use(passport.initialize()); //utilizara de passport el metodo llamado initialize
app.use(passport.session()); //utilizara la sesion definida con express
app.use(flash()); //Utiliza flash

//Variables Globales colocar datos que se van a ver en toda la pagina
app.use((req, res, next) => { //variable global que almacena los mensajes flash
  res.locals.success_msg = req.flash('success_msg'); //Almacena los mensajes que envie atravez de flash que tenga el nombre success_msg
  res.locals.error_msg = req.flash('error_msg'); //Almacena los mensajes que envie atravez de flash que tenga el nombre error_msg
  res.locals.error = req.flash('error'); //Almacena los mensajes flash de passport
  let user = null
  if(req.user){
    user=JSON.parse(JSON.stringify(req.user))
  }
  res.locals.user = user; //guarda el nombre del usuario
  next();
});


//Rutas: url que irán dondro de la carpeta llamada routes
app.use(require('./routes/index')); //irán las url de mi pagina principal ejemplo /about
app.use(require('./routes/notes')); // url del servidor para que el usuario pueda craer o manejar sus notas, crar nota, eliminar nota, actualizar nota
app.use(require('./routes/users')); //el usuario va poder acceder a url donde se puede autenticar por ejemplo puede acceder a /login, /singin, /singup

//Archivos estaticos: configuara donde esta la carpeta de archivos estaticos
app.use(express.static(path.join(__dirname, 'public'))); //Direccion de la carpeta public

//inicar Servidor
app.listen(app.get('port'), () =>{  //iniciamos el servidor
  console.log('Servidor Iniciado en puerto', app.get('port')); //Muestra un mensaje en consola
});