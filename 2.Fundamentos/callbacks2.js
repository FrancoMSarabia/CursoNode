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

let getEmpleado = (id, callback) => {

    //find Devuelve elvalor del primer elemento
    let empleadoDB = empleados.find(empleados => empleados.id == id);

    if (!empleadoDB) {
        callback(`No existe el empleado con el ID ${id}`);
    } else {
        callback(null, empleadoDB);
    }
}






let getSalario = (empleados, callback) => {

    let salarioDB = salarios.find(respuesta => respuesta.id == empleados.id);

    if (!salarioDB) {
        callback(`No se encontro el salario para el empleado ${empleados.nombre}`);
    } else {
        //Tambien se le puede pasar un objeto al callback
        callback(null, {
            nombre: empleados.nombre,
            salario: salarioDB.salario,
            id: empleados.id
        });
    }
}




getEmpleado(1, (err, empleado) => {

    if (err) {
        console.log(err);
    }


    //Llamamos al callback
    getSalario(empleado, (err, respuesta) => {
        if (err) {
            console.log(err);
        }

        console.log(`El salario de ${respuesta.nombre} es de ${respuesta.salario}`);
    });

});