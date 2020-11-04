const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const mongooseHidden = require('mongoose-hidden')(); //Para ocultar un parametro de la tabla

let rolesValidos = {
    values: ['ADMIN_ROLE','USER_ROLE','SUPER_ROLE'],
    message: '{VALUE} no es un rol válido'
};

let Schema = mongoose.Schema;

//Esta es la configuración del squema o bien los campos que tendra la tabla con sus validación y tipo de dato
let usuarioSchema = new Schema({
    nombre : {
        type: String,
        required : [true, 'El nombre es necesario']
    },
    email:{
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password:{
        type:String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos //
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

//El método toJSON en un esquema se utiliza siempre cuando se quiere imprimir
//Modificamos cuando se imprima mediante un toJSON el esquema.
//usuarioSchema.method.toJSON = function(){
   
  //  let user = this;
    //let userObject = user.toObject();
   // delete userObject.password;

    //return userObject;
//}


//Le decimos al esquema que utilize este plugin para agregar un mensaje de validación
usuarioSchema.plugin(uniqueValidator, {message: '{PATH} debe de ser unico'});

//Agregamos este plugin para ocultar campos al momento de hacer la petición
usuarioSchema.plugin(mongooseHidden, {hidden: {_id: false, password: true}});

module.exports = mongoose.model('Usuario', usuarioSchema);