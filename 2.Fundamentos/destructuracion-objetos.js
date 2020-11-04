let deadpool = {
    nombre: 'Wade',
    apellido: 'Winston',
    poder: 'Regeneracion',
    getNombre: function() {
        return `${this.nombre} ${this.apellido} - poder: ${this.poder}`;
    }
}

console.log(deadpool.getNombre());

//Aqui desestructuramos un objeto
let { nombre: primerNombre, apellido, poder } = deadpool;
console.log(primerNombre, apellido, poder);