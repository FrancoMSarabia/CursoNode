let empleados = [{
        id: 1,
        nombre: 'franco'
    },
    {
        id: 2,
        nombre: 'Fernando'
    },
    {
        id: 3,
        nombre: 'Juan'
    }
];

let salarios = [{
        id: 1,
        salario: 1000
    },
    {
        id: 2,
        salario: 2000
    }
];


let getEmpleado = (id) => {

    return new Promise((resolve, reject) => {

        //find Devuelve elvalor del primer elemento
        let empleadoDB = empleados.find(empleados => empleados.id == id);

        if (!empleadoDB) {
            reject(`No existe el empleado con el ID ${id}`);
        } else {
            resolve(empleadoDB);
        }
    });

}

let getSalario = (empleados) => {

    return new Promise((resolve, reject) => {
        let salarioDB = salarios.find(respuesta => respuesta.id == empleados.id);

        if (!salarioDB) {
            reject(`No se encontro el salario para el empleado ${empleados.nombre}`);
        } else {
            resolve({
                nombre: empleados.nombre,
                salario: salarioDB.salario,
                id: empleados.id
            });
        }
    });
}


//Llamando a las promesas
// getEmpleado(1).then(respuesta => {
//     console.log('Empleado de BD', respuesta);

//     getSalario(respuesta).then(res => {
//         console.log(`El salario de ${res.nombre} es de ${res.salario}`);
//     }, err => {
//         console.log(err);
//     });

// }, (err) => {
//     console.log(err);
// });


//Promesas en cadena
getEmpleado(1).then(respuesta => {

    return getSalario(respuesta);

}).then(res => {
    console.log(`El salario de ${res.nombre} es de ${res.salario}`);
}).catch(err => {
    console.log(err);
});

//El catch es para controlar los errores en las promesas en cadena