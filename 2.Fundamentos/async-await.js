//Colocando la palabra async convertimos la función en asyncrona y tambien la convertimos en una promesa, devuelve
//una promesa
// let getNombre = async() => {

//     //Podemos mandar este mensaje al haber un error
//     throw new Error('No existe un nombre para ese usuario');

//     return 'Fernando';
// }

let getNombre = () => {

    return new Promise((resolve, reject) => {

        setTimeout(() => {
            resolve('Fernando');
        }, 3000);

    });
}

getNombre().then(respuesta => {
    console.log(respuesta);
}).catch(e => {
    console.log('error de async', e);
});


let saludo = async() => {

    //El await sirve para llamar al valor que esta devolviendo la promesa, esto evita tener que ecribir el then
    //ademas el await solo se coloca cuando la función devuelve una promesa,ademas es sincrona ya que espera a 
    //+que la promesa devuelva el valor antes de ser ejecutada
    let nombre = await getNombre();

    return `Hola ${nombre}`;
}


saludo().then(response => {
    console.log(response);
}).catch(err => {
    console.log(err);
});