
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Controlador Productos |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import { DaoProducto } from "../../Dao/index.js";
import { FECHA_UTILS, ERRORES_UTILS, JOI_VALIDADOR, LOGGER_UTILS } from "../../Utilidades/index.js";
import { logger } from '../../Configuracion/logger.js';


const obtenerTodos = async (solicitud, respuesta) => {
    try {
        const productos = await DaoProducto.obtenerTodos();

        if (!productos) return logger.error({ error: ERRORES_UTILS.MESSAGES.ERROR_PRODUCTO });

        respuesta.send(productos);
    } catch (error) {
        respuesta.send({ error, error: "Error al obtener los productos solicitados" })
    }
};

const obtenerXid = async (solicitud, respuesta) => { //{ data: product }
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
        logger.info({ nuevoProducto })
        const productoCreado = await DaoProducto.guardar(nuevoProducto);

        respuesta.send(productoCreado);
    } catch (error) {
        await LOGGER_UTILS.addLog(error);
        respuesta.send({ error, error: "Error al crear el producto solicitado" })
    }
};

const actualizar = async (solicitud, respuesta) => {
    try {
        const { productoId } = solicitud.params;

        const { titulo, descripcion, stock, codigo, precio, imagen } = solicitud.body


        const productoValidado = await JOI_VALIDADOR.productoJoi.validateAsync({
            titulo, descripcion, codigo, imagen, precio, stock,
        });
        logger.info({ productoValidado })

        const productoActualizado = await DaoProducto.actualizar({ productoValidado }, (productoId))

        respuesta.send({ success: true, mensaje: "Se actualizo el producto correctamente", producto: productoActualizado })

    } catch (error) {
        respuesta.send({ error: "Error al actualizar un producto" })
    }
};

const eliminarXid = async (solicitud, respuesta) => {
    try {
        const { id } = solicitud.params;

        const productoEliminado = await DaoProducto.eliminarXid(id);

        respuesta.send({ success: true, eliminado: productoEliminado });
    } catch (error) {
        respuesta.send({ error, error: "Error al eliminar el producto solicitado" })
    }
};

const eliminarTodos = async (solicitud, respuesta) => {
    try {
        await DaoProducto.eliminarTodos();

        respuesta.send({ success: true });
    } catch (error) {
        respuesta.send({ error, error: "Error al eliminar todos los productos" })
    }
};

export const controladorProductos = {
    obtenerTodos,
    obtenerXid,
    crearProducto,
    actualizar,
    eliminarXid,
    eliminarTodos
};


