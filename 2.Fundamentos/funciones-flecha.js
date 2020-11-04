//Funcion flecha que recibe parametros
let sumar = (a, b) => {
    return a + b;
}

//Tambien se puede definir haci, cuando la función solo tiene un return
let sumar2 = (a, b) => a + b;
console.log(sumar(10, 20));


let saludar = () => 'hola mundo';
console.log(saludar());

let saludar2 = (nombre) => `hola ${nombre}`;
console.log(saludar2('franco'));

let deadpool = {
    nombre: 'Wade',
    apellido: 'Winston',
    poder: 'Regeneracion',
    getNombre: function() {
        return `${this.nombre} ${this.apellido} - poder: ${this.poder}`;
    }
}