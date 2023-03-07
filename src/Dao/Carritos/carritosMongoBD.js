
import { ContenedorMongoBD } from "../../Contenedores/index.js";
import { modeloCarrito } from "../../Modelos/index.js";


export class CarritosMongoBD extends ContenedorMongoBD {
    constructor() {
        super({
            nombre: modeloCarrito.ColeccionCarrito,
            schema: modeloCarrito.CarritoEsquema,
        });
    }

    async obtenerXid(id) {
        const respuesta = await this.model.findById(id).populate("productos");

        return respuesta;
    }

    async añadirProducto(id, producto) {
        try {
            const respuesta = await this.model.findByIdAndUpdate(id, { $push: { productos: producto } }, { new: true })
            return respuesta;

        } catch (error) {
            logger.warn(error);
        }
    }

    async eliminarProducto(id, producto) {
        try {
            const respuesta = await this.model.findByIdAndUpdate(id, { $pull: { productos: producto } })
            return respuesta;

        } catch (error) {
            logger.warn(error);
        }
    }
}
