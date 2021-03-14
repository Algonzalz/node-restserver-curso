const mongoose = require('mongoose');
const uniqueValidators = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

let roleValidator = {
    values: ['AMIND_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not a valid role'
}

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: roleValidator
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


// para modificar el json de respuesta y eliminar el campo pássword para que no lo vea en el endpoint
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

usuarioSchema.plugin(uniqueValidators, { message: '{PATH} debe ser unico' })

module.exports = mongoose.model('Usuario', usuarioSchema);