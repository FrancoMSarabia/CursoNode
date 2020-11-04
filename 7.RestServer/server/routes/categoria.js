const express = require('express');
const {verificaToken,verificaAdminRole,permisoDeleteCategoria} = require('../middlewares/autenticacion');
const _ = require('underscore');

const app = express();

const Categoria = require('../models/categoria');
const Usuario = require('../models/usuario');

//============================
//Mostrar todas las categorias
//============================
app.get('/categoria', verificaToken , (req, res)=>{

    Categoria.find()
    .sort('descripcion') //Que ordene los registros por la descripcion
    .populate('usuario', 'nombre email') //Mostrara los campos de la coleccion asociada, solo los campos nombre email
    .exec(async (err, categorias)=>{

            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
    
            let conteo = await Categoria.countDocuments();
            
            res.status(200).json({
                ok: true,
                categorias,
                Num_Registros : conteo
        });
    });

});

//============================
//Mostrar una categoria por ID
//============================
app.get('/categoria/:id', (req, res)=>{

    let id = req.params.id;

    Categoria.findById(id, (err, categoria)=>{

        Usuario.populate(categoria,{path:'usuario'}, async(err, categoria)=>{

            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.status(200).json({
                ok: true,
                categoria
            });
        });
    });

});

//============================
//Crear nueva categoria
//============================
app.post('/categoria', [verificaToken,verificaAdminRole] ,(req, res)=>{

    let id = req.usuario._id;
    let body = req.body;

    let categoria = new Categoria({
        descripcion : body.descripcion,
        usuario : id
    });

    categoria.save((err, categoriaDB)=>{

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!categoria){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoriaDB
        });
    });

});

//============================
//Actualizar categoria
//============================
app.put('/categoria/:id',[verificaToken, verificaAdminRole], (req, res)=>{

    let id = req.params.id;
    
    let body = _.pick(req.body, ['descripcion']);
    
    Categoria.findByIdAndUpdate(id, body, {new: true, runValidators: true, context: 'query'} , (err,categoriaDB)=>{

        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

          res.json({
              ok: true,
              categoria : categoriaDB
          });
      });
});

//============================
//Borrar categoria
//============================
app.delete('/categoria/:id', [verificaToken,permisoDeleteCategoria], (req, res)=>{

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada)=>{

        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            "categoria eliminada": categoriaBorrada
        });
    });
    
});

module.exports = app;