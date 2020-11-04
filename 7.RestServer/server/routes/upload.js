const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');

//Este middleware carga todos los archivos que se esteen subiendo en una propiedad llamado files
app.use( fileUpload({ useTempFiles: true }) );


app.put('/upload/:tipo/:id', (req, res)=> {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({

            ok: false,
            err : {
                message: 'No se ha seleccionado ningun archivo.'
            }

        });
      }

      //Validar tipo
      let tiposValidos = ['productos','usuarios'];

      if(tiposValidos.indexOf(tipo) < 0){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son: ' + tiposValidos.join()
            }
        });
      }


      //Aqui capturamos lo que se le coloque en el input, en este caso archivo sera un parametro en la petición
      let archivo = req.files.archivo;

      let archivoSubido = archivo.name.split('.');
      let extension = archivoSubido[archivoSubido.length - 1];

      //Extenciones permitidas
      let extensionesValidas = ['png','jpg', 'gif', 'jpeg'];

      if(extensionesValidas.indexOf(extension) < 0 ){

        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join()
            }
        });
      }


      //Cambiar nombre al archivo
      //Le agregamos los milisegundos para que el nombre del archivo tenga un nombre unico
      let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;


      //Esta es la ruta en donde se va a subir el archivo
      archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {

        if (err)
          return res.status(500).json({
            ok: false,
            err
          });

          imagenUsuario(id, res,nombreArchivo);
      });
});

function imagenUsuario(id,res,nombreArchivo){

    Usuario.findById(id,(err,usuarioDB)=>{

        if (err)
          return res.status(500).json({
            ok: false,
            err
          });

          
        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                message: 'Usuario no existe'
              });
        }

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err,usuarioGuardado)=>{

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });

        });

    });

}

function imagenProducto(){

}

module.exports = app;