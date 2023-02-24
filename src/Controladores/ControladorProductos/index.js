
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Controlador Productos |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import { DaoProducto } from "../../Dao/index.js";
import { FECHA_UTILS, ERRORES_UTILS, JOI_VALIDADOR, LOGGER_UTILS } from "../../Utilidades/index.js";
import { logger } from '../../Configuracion/logger.js';


const obtenerTodos = async (solicitud, respuesta) => {
    try {
        const producto = await DaoProducto.obtenerTodos();

        if (!producto) return logger.error({ error: ERRORES_UTILS.MESSAGES.ERROR_PRODUCTO });

        respuesta.send(producto);
    } catch (error) {
        respuesta.send({ error, error: "Error al obtener los productos solicitados" })
    }
};

const obtenerXid = async (solicitud, respuesta) => {
    try {
        const { id } = solicitud.params;

        const producto = await DaoProducto.obtenerXid(id);

        respuesta.send(producto);
    } catch (error) {
        respuesta.send({ error, error: "Error al obtener el producto solicitados" })
    }
};

const crearProducto = async (solicitud, respuesta) => {
    try {
        const { titulo, descripcion, codigo, imagen, precio, stock } = solicitud.body;

        const nuevoProducto = await JOI_VALIDADOR.productoJoi.validateAsync({
            titulo, descripcion, codigo, imagen, precio, stock,
            timestamp: FECHA_UTILS.getTimestamp(),
        });

        const productoCreado = await DaoProducto.guardar(nuevoProducto);

        respuesta.send(productoCreado);
    } catch (error) {
        await LOGGER_UTILS.addLog(error);
        respuesta.send({ error, error: "Error al crear el producto solicitado" })
    }
};

const actualizarProdXid = async (solicitud, respuesta, next) => {
    const { id } = solicitud.params
    const { titulo, precio, imagen } = solicitud.body
    daoProductos.actualizar({ titulo, precio, imagen }, Number(id))
    respuesta.json({ datos: { titulo, precio, imagen } })
}


const actualizarProducto = async (solicitud, respuesta) => {
    try {
        const { productoId } = solicitud.params;

        // const producto = await DaoProducto.obtenerXid(productoId);
        // if (!producto) return respuesta.send({ error: "Error, no se encontro el producto" })

        const { titulo, descripcion, stock, codigo, precio, imagen } = solicitud.body

        const productoActualizado = await DaoProducto.actualizar({ titulo, precio, imagen, descripcion, stock, codigo }, (productoId))
        respuesta.send({ success: true, mensaje: "Se actualizo el producto correctamente", producto: productoActualizado })

    } catch (error) {
        respuesta.send({ error: "Error al eliminar un producto del carrito" })
    }
};

const eliminarXid = async (solicitud, respuesta) => {
    try {
        const { id } = solicitud.params;

        await DaoProducto.eliminarXid(id);

        respuesta.send({ success: true });
    } catch (error) {
        respuesta.send({ error, error: "Error al eliminar el producto solicitado" })
    }
};

export const controladorProductos = {
    obtenerTodos,
    obtenerXid,
    crearProducto,
    actualizarProducto,
    eliminarXid,
};


