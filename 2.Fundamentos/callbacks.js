//un callback se ejecuta cuando pasa algo, en este caso cuando pasen los 3 segundos, en este caso la funcion
//es el callback
setTimeout(() => {
    console.log('Hola mundo');
}, 3000);

//Le pasamos como parametro el id y una función que vendria siendo el callback
let getUsuarioById = (id, callback) => {

    let usuario = {
        nombre: 'Franco',
        id //El id es igual al id que se le pasa por parametro, asi que se puede omitir y solo poner "id"
    }

    if (id === 20) {
        callback(`El usuario con ${id} no existe en la BD`);
    } else {
        //con null quiere decir que el error no existe por lo tanto que se ejecute lo que esta en el callback
        callback(null, usuario);
    }
}

getUsuarioById(2, (err, usuario) => {

    //Si hay un error
    if (err) {
        return console.log(err);
    }

    console.log('Usuario de base de datos ', usuario);
});