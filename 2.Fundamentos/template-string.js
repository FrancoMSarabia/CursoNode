let nombre = 'Deadpools';
let real = 'Wade Winston';

//Este es un template literal
console.log(`Nombre: ${nombre},  dead: ${real}`);




nombreCompleto = nombre + ' ' + real;
nombreTemplate = `${nombre} ${real}`;

//Da true por que son extactamente iguales
console.log(nombreCompleto === nombreTemplate);



function getNombre() {
    return `${nombre} ${real}`;
}

//Tambien podemos usarlos para llamar funciones
console.log(`El nombre es: ${ getNombre() }`);