const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require ( 'google-auth-library' ); 
const client = new OAuth2Client ( process.env.CLIENT_ID );

const Usuario = require('../models/usuario');

const app = express();

app.post('/login',(req,res)=>{

    let body = req.body;

    //Si cumple con la condición devolvera el usuario, si no cumple con la condición devuelve un arreglo vacio
    Usuario.findOne({email : body.email}, (err, response)=>{

        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!response){
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }

        //Si la contraseña que le definimos en la petición no es igual a la contraseña que esta en el usuario de la BD
        if(!bcrypt.compareSync(body.password, response.password)){
            
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }

        //Aqui creamos el token, el primer argumento es el contenido o payload del token, el segundo argumento
        //corresponde al secret o al seed que se necesita para que el token sea valido, y el tercer 
        //argumento corresponde al tiempo de expiración del token, SEGUNDOS,MINUTOS,HORAS,DIAS
        let token = jwt.sign({
            usuario: response
        },process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});

        res.json({
            ok: true,
            usuario: response,
            token
        });

    });

});


//CONFIGURACIONES DE GOOGLE
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    
    const payload = ticket.getPayload();
    const userid = payload['sub'];

    console.log(userid);
    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return{
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
    }
  }
  //verify().catch(console.error);


app.post('/google',async (req,res)=>{

    //Recibimos el token que nos envia desde el front end
    let token = req.body.idtoken;

    let googleUser = await verify(token).catch(err=>{

        return res.status(403).json({
            ok:false,
            err
        });
    });

    //Que devuelva el registro si el email del esquema sea igual al lo que venga del token
    Usuario.findOne({email: googleUser.email}, (err,usuarioDB)=>{

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(usuarioDB){
            
            //Si el usuario no esta autenticado por google.
            if(usuarioDB.google === false){
                
                return res.status(400).json({
                    ok: false,
                    err:{
                        message: 'Debe de usar su autenticación normal'
                    }
                });

            }else{
                
                let token = jwt.sign({
                    usuario: usuarioDB
                },process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        }
        else{

            //Creamos un nuevo usuario en las base de datos
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':=)'; //no es necesario el password para validar pero se agrega para pasar la validación
            
            usuario.save((err,usuarioDB)=>{
                
                if(err){
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                },process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });

            });
        }

    });
});

module.exports = app;