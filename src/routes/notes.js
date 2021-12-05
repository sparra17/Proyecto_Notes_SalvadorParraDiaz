// url del servidor para que el usuario pueda craer o manejar sus notas, crar nota, eliminar nota, actualizar nota

const express = require('express'); //requiero express para crear rutas y lo guardo en una variable del mismo nombre
const { restart } = require('nodemon');
const router = express.Router();//utilizo express para llamar al metodo Router permite tener un objeto que puede facilitar la creacion de rutas

const Note = require('../models/Note'); //requiero de la carpeta models el archivo Note.js y guarda en constante Note
const { isAuthenticated } = require('../helpers/auth') //desde el archivo auth se va a utilizar el metodo isAuthenticated

router.get('/notes/add', isAuthenticated, (req, res) => { //cuando ingrese a esta ruta si esta autenticado va a ver un formulario para agregar una nueva nota
  res.render('notes/new-note'); //envia el formulario new-note
});

router.post('/notes/new-note', isAuthenticated, async (req, res) => { /*ruta para recibir los datos, si esta autenticado el usuario, cuando el 
          formulario envie una peticion post se trata de recibir en /notes/new-note, dentro hay procesos asincronos*/
  const { title, description} = req.body; //obtiene del req.body el title y description como constantes
  const errors = []; //se van a colocar los mensajes de errores en caso existan
  if(!title){ //validacion de titulo... si no hay un titulo
    errors.push({text: 'Inserte Un Titulo'}); //muestra un mensaje si no hay un titulo
  }
  if(!description){ //validacion de la descripcion... si no hay una descripcion
    errors.push({text: 'Inserte Una Descripcion'}); //muestra un mensaje si no hay una descripcion
  }
  if(errors.length > 0) { //si hay errores 
    res.render('notes/new-note', { //va a renderizar nuevamente el formulario new-note
      errors, //mostar errores
      title, //para no tipear nuevamente el titulo
      description //para no tipear nuevamente la descripcion
    });
  } else { //en caso de que no tenga errores almacenar (el modelo de datos) la nota en la base de datos
    const newNote = new Note({title, description}); //Crea un nuevo dato new Note y se le va a pasar el titulo y la descripcion y se almacena en una constante newNote
    newNote.user = req.user.id; //se enlaza el id del usuario con la nota para ver solamente las notas de dicho usuario
    await newNote.save(); //guarda la nota en la base de datos de forma asincrona
    req.flash('success_msg', 'Nota Agregada') //Una vez guardada la nota va a mostrar un mensaje de exito
    res.redirect('/notes'); //una vez guardado se redirecciona a /notes, muestra las notas en la db
  }
});

router.get('/notes', isAuthenticated, async (req, res) => {  //Ruta llamada /notes para mostrar las notas si esta autenticado el usuario
  const notes = await Note.find({user: req.user.id}).lean().sort({date: 'desc'}); //De las notas que hay en la db busca todas y muestra solo las que estan relacionadas con el user.id y las retorna a notes de manera descendente
  res.render('notes/all-notes', { notes }); //renderiza el archivo all-notes y pasa los datos de las notas 
});

//Ruta para editar las notas "Aun no disponible en la pagina"
router.get('/notes/edit/:id', isAuthenticated, async (req, res) => { //Cuando entre a la ruta
  await Note.findById(req.params.id).then((datos) => { //Buscar un dato por ID, pasa el ID que pasa el usuario
    //console.log(datos);
    const contexto = {
      title: datos.title,
      description: datos.description,
      //_id: datos._id,
    };
    res.render('notes/edit-note', {note: contexto}); //Renderiza la ruta edit-note y muestra la nota
  });
});
//Ruta para editar las notas "Aun no disponible en la pagina"
router.put('/notes/edit-note/:id', isAuthenticated, async (req,res) => { //
  const {title, description } = req.body; //guarda en una constante el titulo y la desripcion obtenidos
  await Note.findByIdAndUpdate(req.params.id, { title, description}); //Para actualizar las notas pasando los datos nuevos
  req.flash('success_msg', 'Nota Actualizada'); //Si se edita correctamente manda un mensaje
  res.redirect('/notes'); //una vez actualizado redirecciona a la ruta /notes
});

router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => { //si esta autenticado el usuario, utiliza el metodo delete para elimiar una nota
  await Note.findByIdAndDelete(req.params.id); //desde el modelo de datos Note busca y elimina la nota asociada al ID
  req.flash('success_msg', 'Nota Eliminada'); //Si se elimina correctamente manda un mensaje de exito
  res.redirect('/notes'); //Redirecciona a /notes
});


module.exports = router; //necesito exportar