const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');

const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

const app = express();

//========================================================
//=====================CONSULTAR==========================
//========================================================

//Utilizamos el middleware "verificaToken" antes de que llege la petición al servidor
app.get('/usuario', verificaToken ,(req, res)=> {

    //Aqui utilizamos el usuario del payload del token que viene del middleware
    /*return res.json({
        usuario: req.usuario,
        nombre: req.usuario.nombre,
        email: req.usuario.email
    });*/
    
    //le decimos a la variable que sea igual a lo que le pasemos por parametro opcional en la url y si no existe 
    //ese parametro que sea el valor 0
    let desde = Number(req.query.desde || 0);
    let limite = Number(req.query.limite || 5);

    //El mpetodo find busca y devuelve todos los elementos que contenga la colección en la base de datos
    //El método exec ejecuta el find y devuelve lo que le especificamos en el find
    //El método limit establece el limite de registros que se quiere devolver
    //El método skip salta los regitros
    Usuario.find({estado:true},'nombre email') //Devolvera solo los registros que su estado sea true, y le especificamos que muestre solo los campos nombre y email
    .skip(desde)
    .limit(limite)
    .exec(async (err, usuarios)=>{

        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        
        //Devuelve el número de documentos de una colección en mongo
        let conteo = await Usuario.countDocuments({estado:true});
        
        res.status(200).json({
            ok: true,
            usuarios,
            Num_Registros : conteo
        });


    });
});
  

//====================================================
//======================CREAR=========================
//====================================================
  app.post('/usuario', [verificaToken, verificaAdminRole], function (req, res) {
  
      //Almacenamos el body que viene del midleware
      let body = req.body;

    //Asignamos a los campos el valor que viene del cuerpo de la petición
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password,10),  //Con este método le decimos que sea syncrono y no asyncrono
        role: body.role
    });

    //save es un método perteneciente a mongoose
    usuario.save((err, usuarioDB)=>{

        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });
                
    });
  });
  

  //===========================================================
  //======================ACTUALIZAR===========================
  //===========================================================
  app.put('/usuario/:id', [verificaToken, verificaAdminRole] , (req, res) => {
  
      let id = req.params.id;
      
      //Aqui utilizamos la libreria underscore y lo que hace este método es colocar los nombres de las propiedades
      //que se quiere que se puedan actualizar.
      let body = _.pick(req.body, ['nombre','email','img','role','estado']);

      //============================================================
      //=============OTRA FORMA DE REALIZAR LA OPERACIÓN============
      
      //const validFields = ['name', 'email', 'img', 'role', 'state']
      //const changes = {}
    
      //Object.keys(req.body)
        //.filter(key => validFields.includes(key))
        //.forEach(key => changes[key] = req.body[key])  

      //=============================================================



      //Método de mongoose que busca a un registro por el id y lo actualiza

      //===============================================================
      //====================OPCIONES DEL MÉTODO========================
      
      //con new:true es un parametro opcional y lo que hace es devolver el objeto actualizado, si no se le coloca
      //nos devuelve el objeto anterior a actualizar pero en la base de datos si se actualiza.

      //con runValidators las validaciones que tiene el esquema se activan

      //si se configura en context:'query' y se ejecuta runValidators, esto hará referencia a la consulta en las 
      //funciones de validación personalizadas del esquema. No hace nada si runValidators es falso.
      
      //================================================================
      Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true, context: 'query'} , (err,usuarioDB)=>{

        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

          res.json({
              ok: true,
              usuario : usuarioDB
          });
      });
  
  });
  

  app.delete('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) =>{
     
        let id = req.params.id;
        
        let cambiaEstado = {
            estado: false
        };

        //Con este método borramos un documento que buscamos a taves del id, pero hoy en dia no se aconseja eliminar
        //nada si no solo cambiarle el estado.
        //Usuario.findByIdAndRemove(id,(err, usuarioBorrado)=>{
        
        Usuario.findByIdAndUpdate(id,cambiaEstado,{new: true},(err, usuarioBorrado)=>{
            
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if(!usuarioBorrado){
                
                return res.status(400).json({
                    ok: false,
                    err : {
                        message: 'Usuario no encontrado'
                    }
                });
            }

            res.json({
                ok: true,
                usuario : usuarioBorrado
            });

        });

  });


  module.exports = app;