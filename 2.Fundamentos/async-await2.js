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


let getEmpleado = async(id) => {

    //find Devuelve elvalor del primer elemento
    let empleadoDB = empleados.find(empleados => empleados.id == id);

    if (!empleadoDB) {
        throw new Error(`No existe el empleado con el ID ${id}`);
    } else {
        return (empleadoDB);
    }

}

let getSalario = async(empleados) => {

    let salarioDB = salarios.find(respuesta => respuesta.id == empleados.id);

    if (!salarioDB) {
        throw new Error(`No se encontro el salario para el empleado ${empleados.nombre}`);
    } else {
        return {
            nombre: empleados.nombre,
            salario: salarioDB.salario,
            id: empleados.id
        };
    }
}


let getInformacion = async(id) => {

    let empleado = await getEmpleado(id);
    let respuesta = await getSalario(empleado);

    return `${respuesta.nombre} tiene un salario de ${respuesta.salario}$`;

}

getInformacion(1).then(mensaje => {
    console.log(mensaje);
}).catch(err => {
    console.log(err);
});