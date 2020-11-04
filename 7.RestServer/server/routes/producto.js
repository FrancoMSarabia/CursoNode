const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

const _ = require('underscore');

let app = express();

let Producto = require('../models/producto');


//==========================
//Obtener productos
//==========================
app.get('/productos', verificaToken,(req,res)=>{

    //Trae todos los productos
    //populate: usuario categoria
    //paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    //Que devuelva solo los productos que estan disponibles
    Producto.find({disponible : true})
    .skip(desde)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec(async (err, productos)=>{

        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //let conteo = await Producto.countDocuments();


        Producto.countDocuments({ disponible: true }, (err, conteo) => {

            res.status(200).json({
                ok: true,
                productos,
                Num_Registros : conteo
            });
        });

    });

});

//==========================
//Obtener producto por ID
//==========================
app.get('/producto/:id', (req,res)=>{

    //populate: usuario categoria

    let id = req.params.id;

    Producto.findById(id)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec((err,producto)=>{

        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto
        });


    })

});


//==========================
//Buscar productos
//==========================
app.get('/productos/buscar/:termino', verificaToken,(req,res)=>{

    let termino = req.params.termino;

    let expresionRegular = new RegExp(termino, 'i');

    //Va a buscar un producto que su nombre sea igual al termino
    Producto.find({nombre: expresionRegular})
    .populate('categoria', 'descripcion')
    .exec((err, productos)=>{

        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok:true,
            productos
        });

    });

});


//==========================
//Crear producto
//==========================
app.post('/producto', verificaToken , (req,res)=>{

    //Grabar el usuario
    //Grabar una categoria del listado
    let body = req.body;

    let producto = new Producto({
        nombre : body.nombre,
        precioUni : body.precioUni,
        descripcion : body.descripcion,
        categoria : body.categoria,
        usuario : req.usuario._id
    });

    producto.save((err, productoDB)=>{

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            productoDB
        });
    });
    
});


//==========================
//Actualizar producto
//==========================
app.put('/producto/:id', (req,res)=>{

    let id = req.params.id;

    let body = _.pick(req.body, ['nombre','precioUni', 'descripcion', 'categoria', 'disponible']);

    Producto.findByIdAndUpdate(id, body, {new: true, runValidators: true, context: 'query'} , (err,productoDB)=>{

        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

          res.json({
              ok: true,
              producto : productoDB
          });
    });
    
});


//==========================
//Borrar producto
//==========================
app.delete('/producto/:id', verificaToken, (req,res)=>{

    let id = req.params.id;
        
    let cambiaEstado = {
        disponible: false
    };

    Producto.findByIdAndUpdate(id, cambiaEstado, {new: true},(err, productoBorrado)=>{

        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!productoBorrado){
                
            return res.status(400).json({
                ok: false,
                err : {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto : productoBorrado
        });


    });

});

module.exports = app;