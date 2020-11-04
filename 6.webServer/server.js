const express = require('express')
const app = express();
const hbs = require('hbs');

require('./hbs/helpers');

//Aqui obtenemos el puerto, si se corre en remoto lo obtendra del PORT si se esta en local utilizara el puerto 3000
const port = process.env.PORT || 3000;


//Esta url se ejecutara siempre y si no encuentra la ruta entonces ejecutara lo de abajo
//app.use(express.static(__dirname + '/public'));

//le decimos que en esa carpeta contendra todos los parciales, los parciales son codigo html que se puede reutilizar
hbs.registerPartials(__dirname + '/views/parciales');

//Importando el hbs que es como un motor de templates para trabajar con paginas dinamicas
app.set('view engine', 'hbs');


//==================SERVIDORES===================================
app.get('/', (req, res) => {

    //Que renderize el home.hbs, y el segundo argumento le enviamos estos parametros al template
    res.render('home', {
        nombre: 'Franco',
        anio: new Date().getFullYear()
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        anio: new Date().getFullYear()
    });
});

app.listen(port, () => {
    console.log(`Escuchando peticiones desde el puerto ${port}`);
});
//=================================================================


//Creamos el servidor con express
// app.get('/', (req, res) => {

//     let salida = {
//         nombre: 'Fernando',
//         edad: 32,
//         url: req.url //quiere decir que almacenara la url que le especifiquemos
//     }

//     //send devuelve siempre un JSOn
//     res.send(salida);
// });