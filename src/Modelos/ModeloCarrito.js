
import { Schema } from "mongoose";

const ColeccionCarrito = "carrito";

const CarritoEsquema = new Schema(
    {
        id: Schema.Types.ObjectId,
        timestamp: { type: Date, default: Date.now },
        usuario: [{ type: Schema.Types.ObjectId, ref: "usuarios" }],
        productos: [{ type: Schema.Types.ObjectId, ref: "productos" }],
    },
    {
        virtuals: true,
    }
);

CarritoEsquema.set("toJSON", {
    transform: (_, respuesta) => {
        respuesta.id = respuesta._id;
        delete respuesta._id;
        return respuesta;
    },
});

export const modeloCarrito = { ColeccionCarrito, CarritoEsquema };
