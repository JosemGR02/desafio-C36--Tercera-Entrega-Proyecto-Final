
import { Schema } from "mongoose";


const ColeccionUsuarios = "UsuariosM";

const esquemaUsuario = new Schema({
    nombre: { type: String, required: true, max: 40 },
    edad: { type: Number, required: true, max: 3 },
    email: { type: String, required: true, unique: true, max: 30 },
    contraseña: { type: String, required: true, max: 30 },
    telefono: { type: Number, required: true, max: 20 },
    direccion: { type: String, required: true, max: 40 },
    avatar: { type: String, required: true, max: 150 },
    // carrito: { type: Schema.Types.ObjectId, ref: 'carrito' }
});


esquemaUsuario.set("toJSON", {
    transform: (_, respuesta) => {
        respuesta.id = respuesta._id;
        delete respuesta.__v;
        delete respuesta._id;
        return respuesta;
    },
});

export const modeloUsuario = { esquemaUsuario, ColeccionUsuarios };


