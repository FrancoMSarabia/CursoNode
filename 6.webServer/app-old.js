const http = require('http');

//Aqui creamos el servidor, y le decimos que escuche el puerto 8080
http.createServer((request, response) => {

    response.writeHead(200, { 'Content-Type': 'application/json' });

    let salida = {
        nombre: 'Fernando',
        edad: 32,
        url: request.url //quiere decir que almacenara la url que le especifiquemos
    }

    response.write(JSON.stringify(salida));
    response.end(); //Terminamos de crear la respuesta
}).listen(8080);