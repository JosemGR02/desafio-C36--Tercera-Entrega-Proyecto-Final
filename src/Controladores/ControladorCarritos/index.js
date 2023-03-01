
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Controlador Carrito Compra |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import nodemailer from 'nodemailer';
import { config } from '../../Configuracion/config.js';
import { logger } from '../../Configuracion/logger.js';
import { transporter, client } from '../../Servicios/index.js';
import { FECHA_UTILS, ERRORES_UTILS } from "../../Utilidades/index.js";
import { DaoCarrito, DaoProducto } from '../../Dao/index.js';



const obtenerCarritoXid = async (solicitud, respuesta) => {
    try {
        const { id } = solicitud.params;

        const carrito = await DaoCarrito.obtenerXid(id);

        if (!carrito)
            return respuesta.send({ error: true, mensaje: ERRORES_UTILS.MESSAGES.ERROR_CARRITO });

        respuesta.send({ success: true, carrito });
    } catch (error) {
        respuesta.send(`${error}, Error al obtener el carrito solicitado`);
    }
};

const crearCarrito = async (solicitud, respuesta) => {
    try {
        const carritoBase = { timestamp: FECHA_UTILS.getTimestamp(), usuario: [], productos: [] };

        const nuevoCarrito = await DaoCarrito.guardar(carritoBase);

        respuesta.send({ success: true, carritoId: nuevoCarrito });
    } catch (error) {
        respuesta.send(`${error}, Error al crear el carrito`);
    }
};


const guardarProdsCarrito = async (solicitud, respuesta) => {
    try {
        const { carritoId } = solicitud.params;
        const { productoId } = solicitud.body;

        const carrito = await DaoCarrito.obtenerXid(carritoId);

        if (!carrito)
            return respuesta.send({ error: true, mensaje: ERRORES_UTILS.MESSAGES.ERROR_CARRITO });

        const producto = await DaoProducto.obtenerXid(productoId);

        if (!producto)
            return respuesta.send({ error: true, mensaje: ERRORES_UTILS.MESSAGES.ERROR_PRODUCTO });

        carrito.productos.push(producto);

        const carritoActualizado = await DaoCarrito.actualizar(carritoId, carrito);

        respuesta.send({ success: true, carrito: carritoActualizado });
    } catch (error) {
        respuesta.send(`${error}, Error al guardar un producto al carrito`);
    }
};


const actualizarProdsCarrito = async (solicitud, respuesta) => {
    try {
        const { carritoId } = solicitud.params;
        const { productoId } = solicitud.body;

        const carrito = await DaoCarrito.obtenerXid(carritoId);

        if (!carrito)
            return respuesta.send({ error: true, mensaje: ERRORES_UTILS.MESSAGES.ERROR_CARRITO });

        const producto = await DaoProducto.obtenerXid(productoId);
        if (!producto) return respuesta.send({ error: "Error, no se encontro el producto" })

        carrito.productos.push(producto)

        const carritoActualizado = await DaoCarrito.actualizar(carritoId, carrito);

        respuesta.send({ success: true, carrito: carritoActualizado });
    } catch (error) {
        respuesta.send(`${error}, Error al actualizar un producto al carrito`);
    }
};

const obtenerTodosProdsCarrito = async (solicitud, respuesta) => {
    try {
        const { carritoId } = solicitud.params;

        const carrito = await DaoCarrito.obtenerXid(carritoId);
        if (!carrito) { respuesta.send({ error: "Error, no se encontro el carrito" }) }

        else {
            const listadoProductos = carrito.productos;

            if (!listadoProductos) return respuesta.send({ error: true, mensaje: "No se encontraron los productos solicitados" });

            respuesta.send({ success: true, productos: listadoProductos });
        }
    } catch (error) {
        respuesta.send(`${error}, Error al obtener la lista los productos del carrito`);
    }
};

const eliminarProdCarrito = async (solicitud, respuesta) => {
    try {
        const { carritoId, productoId } = solicitud.params;

        const carrito = await DaoCarrito.obtenerXid(carritoId);
        if (!carrito) { respuesta.send({ error: "Error, no se encontro el carrito" }) }

        else {
            const producto = await DaoProducto.obtenerXid(productoId);
            if (!producto) return respuesta.send({ error: "Error, no se encontro el producto" })

            const elementoEncontradoIndex = carrito.productos.findIndex(elemento => elemento.id === Number(productoId))
            if (elementoEncontradoIndex === -1) return respuesta.send({ error: "Error, no se encontro el producto" })
            carrito.productos.splice(elementoEncontradoIndex, 1)
        }
        const carritoActualizado = await DaoCarrito.actualizar(Number(carritoId), carrito)
        respuesta.send({ success: true, mensaje: "Se elimino correctamente el producto del carrito", carrito: carritoActualizado })

    } catch (error) {
        respuesta.send(`${error}, Error al eliminar un producto del carrito`)
    }
};

const eliminarCarritoXid = async (solicitud, respuesta) => {
    try {
        const { carritoId } = solicitud.params;

        const carrito = await DaoCarrito.eliminarXid(carritoId);
        if (!carrito) return respuesta.send({ error: true, mensaje: ERRORES_UTILS.MESSAGES.ERROR_CARRITO });

        respuesta.send({ success: true, mensaje: `Se elimino correctamente el carrito ${carritoId}` })
    } catch (error) {
        respuesta.send(`${error}, Error al eliminar el carrito seleccionado`);
    }
};

const procesarPedido = async (solicitud, respuesta) => {
    try {
        const { carritoId } = solicitud.params;

        const carrito = await DaoCarrito.obtenerXid(carritoId);

        if (!carrito) return respuesta.send({ error: true, mensaje: ERRORES_UTILS.MESSAGES.ERROR_CARRITO });
        if (carrito.length === 0) logger.warn({ mensaje: ERRORES_UTILS.MESSAGES.ERROR_PRODUCTO })

        logger.info(carrito.productos)

        if (solicitud.isAuthenticated()) {

            const usuarioCarrito = solicitud.user;

            carrito.usuario = usuarioCarrito;

            // envio Email
            let envioEmail = {
                from: "Remitente",
                to: config.EMAIL.USUARIO,
                subject: `Nuevo pedido: ${carrito.productos}, de: ${carrito.usuario.nombre}, ${carrito.usuario.email}`,
                text: `Productos solicitados por el usuario: ${carrito.productos}`
            };

            let info = transporter.sendMail(envioEmail, (error, info) => {
                if (error) {
                    logger.error("Error al enviar mail: " + error);
                } else {
                    logger.info(`El email: nuevo pedido, fue enviado correctamente: ${info.messageId}`);
                    logger.info(`Vista previa a URL: ${nodemailer.getTestMessageUrl(info)}`);
                }
            });

            // envio SMS
            const envioSMS = await client.messages.create({
                body: "Su pedido ya ha sido recibido y esta en proceso",
                from: config.WHATSAPP.NRO_TWILIO,
                to: carrito.usuario.telefono
            });

            logger.info(`Mensaje SMS enviado correctamente ${envioSMS}`);

            // envio Whatsapp
            const envioWhatsapp = await client.messages.create({
                body: `Nuevo pedido: ${carrito.productos}, de: ${carrito.usuario.nombre}, ${carrito.usuario.email}`,
                from: config.WHATSAPP.NRO_TWILIO,
                to: `whatsapp:${carrito.usuario.telefono}`
            });

            logger.info(`Mensaje SMS enviado correctamente ${envioWhatsapp}`);

            logger.info('Pedido procesado con exito')
            logger.info(carrito)

            respuesta.render('view/home', { carrito: carrito.productos });
        } else {
            throw new Error("Debes estar autenticado para enviar pedidos");
        }
    } catch (error) {
        respuesta.send(`${error}, Error al procesar el pedido de compra`);
    }
}


export const controladorCarritos = {
    crearCarrito,
    obtenerCarritoXid,
    guardarProdsCarrito,
    obtenerTodosProdsCarrito,
    actualizarProdsCarrito,
    eliminarProdCarrito,
    eliminarCarritoXid,
    procesarPedido
};










