require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();

const path = require('path');

//Hoy en dia express viene con el body parser asi que ya no es necesario instalar este paquete
const bodyParser = require('body-parser')

//Estos son middleware, osea se ejecutara siempre antes de las peticiones, con use utilizamos este middleware en
//todas las rutas
//Hablita la configuración del body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//Con el método resolve que pertenece a node en si, ordena la ruta correctamente, sin este método arrojaria un error
//app.use(express.static(path.resolve(__dirname, '../public')));
app.use(express.static('public'));//Tambien se puede hacer asi


//Añadimos el archivo de configuración global de rutas
app.use(require('./routes/index'));
 

//Conectando a la base de datos de mongodb
mongoose.connect(process.env.URLDB, {useCreateIndex: true, useNewUrlParser: true}, (err, res)=>{

    if(err) throw err;

    console.log('Base de datos ONLINE!!!');

});

app.listen(process.env.PORT, ()=>{
    console.log('Escuchando el puerto: ' , process.env.PORT);
});