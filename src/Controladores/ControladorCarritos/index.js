
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Controlador Carrito Compra |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import { config } from '../../Configuracion/config.js';
import { logger } from '../../Configuracion/logger.js';
import { transporter, client } from '../../Servicios/index.js';
import { FECHA_UTILS, ERRORES_UTILS } from "../../Utilidades/index.js";
import { DaoCarrito, DaoProducto } from '../../Dao/index.js';



const obtenerCarritoXid = async (solicitud, respuesta) => {
    try {
        const { id } = solicitud.params;

        const carrito = await DaoCarrito.obtenerXid(id);

        respuesta.send({ success: true, carrito });
    } catch (error) {
        respuesta.send({ error: "Error al obtener el carrito solicitado" })
    }
};


const crearCarrito = async (solicitud, respuesta) => {
    try {
        const carritoBase = { timestamp: FECHA_UTILS.getTimestamp(), usuario: {}, productos: [] };

        const nuevoCarrito = await DaoCarrito.guardar(carritoBase);

        respuesta.send({ success: true, carritoId: nuevoCarrito.id });
    } catch (error) {
        respuesta.send({ error: "Error al crear el carrito" })
    }
};


const guardarProdsCarrito = async (solicitud, respuesta) => {
    try {
        const { productoId } = solicitud.body;
        const { carritoId } = solicitud.params;

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
        respuesta.send({ error: "Error al guardar un producto al carrito" })
    }
};

const obtenerTodosProdsCarrito = async (solicitud, respuesta) => {
    try {
        const { carritoId } = solicitud.params;

        const carrito = await DaoCarrito.obtenerXid(carritoId);
        if (!carrito) { respuesta.send({ error: "Error, no se encontro el carrito" }) }

        else {
            const listadoProductos = await DaoProducto.obtenerTodos();

            if (!listadoProductos) return respuesta.send({ error: true, mensaje: "No se encontraron los productos solicitados" });

            respuesta.send({ success: true, productos: listadoProductos }); //carrito.productos
        }
    } catch (error) {
        respuesta.send({ error: "Error al obtener la lista los productos del carrito" })
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
        respuesta.send({ error: "Error al eliminar un producto del carrito" })
    }
};

const eliminarCarritoXid = async (solicitud, respuesta) => {
    try {
        const { carritoId } = solicitud.params;

        const carrito = await DaoCarrito.eliminarXid(carritoId);
        if (!carrito) return respuesta.send({ error: true, mensaje: ERRORES_UTILS.MESSAGES.ERROR_CARRITO });

        respuesta.send({ success: true, mensaje: `Se elimino correctamente el carrito ${carritoId}` })
    } catch (error) {
        respuesta.send({ error: "Error al eliminar el carrito seleccionado" })
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
            respuesta.render('view/home', { carrito: carrito.productos });
        } else {
            throw new Error("Debes estar autenticado para enviar pedidos");
        }
    } catch (error) {
        respuesta.send({ error: "Error al procesar el pedido de compra" })
    }
}



// const procesarPedido = async (solicitud, respuesta, next) => {
//     try {
//         const carritoCheckbooks = solicitud.body;

//         logger.info({ ...carritoCheckbooks });

//         if (carritoCheckbooks.length === 0) logger.warn({ mensaje: ERRORES_UTILS.MESSAGES.ERROR_PRODUCTO })
//         if (!carritoCheckbooks) {
//             throw new Error({ mensaje: ERRORES_UTILS.MESSAGES.ERROR_CARRITO });
//         }

//         if (solicitud.isAuthenticated()) {

//             const usuarioCarrito = solicitud.user;
//             // solicitud.user.nombre || solicitud.user; =>

//             // carrito.usuario.nombre
//             // carrito.usuario.email
//             // carrito.usuario.telefono
//             // carrito.productos

//             const carritoBase = { timestamp: FECHA_UTILS.getTimestamp(), usuario: {}, productos: [] };

//             carritoBase.productos.push({ ...carritoCheckbooks.productos });

//             // carritoBase.usuario.push(usuarioCarrito);
//             carritoBase.usuario = usuarioCarrito;

//             const carrito = await DaoCarrito.guardar(carritoBase);

//             logger.info(`Carrito guardado con exito, ${carrito}`);

//             if (carrito.usuario.nombre === solicitud.user.nombre) {

//                 // envio Email
//                 let envioEmail = {
//                     from: "Remitente",
//                     to: config.EMAIL.USUARIO,
//                     subject: `Nuevo pedido: ${carrito.productos}, de: ${carrito.usuario.nombre}, ${carrito.usuario.email}`,
//                     text: `Productos solicitados por el usuario: ${carrito.productos}`
//                 };

//                 let info = transporter.sendMail(envioEmail, (error, info) => {
//                     if (error) {
//                         logger.error("Error al enviar mail: " + error);
//                     } else {
//                         logger.info(`El email: nuevo pedido, fue enviado correctamente: ${info.messageId}`);
//                         logger.info(`Vista previa a URL: ${nodemailer.getTestMessageUrl(info)}`);
//                     }
//                 });

//                 // envio SMS
//                 const envioSMS = await client.messages.create({
//                     body: "Su pedido ya ha sido recibido y esta en proceso",
//                     from: config.WHATSAPP.NRO_TWILIO,
//                     to: carrito.usuario.telefono
//                 });

//                 logger.info(`Mensaje SMS enviado correctamente ${envioSMS}`);

//                 // envio Whatsapp
//                 const envioWhatsapp = await client.messages.create({
//                     body: `Nuevo pedido: ${carrito.productos}, de: ${carrito.usuario.nombre}, ${carrito.usuario.email}`,
//                     from: config.WHATSAPP.NRO_TWILIO,
//                     to: `whatsapp:${carrito.usuario.telefono}`
//                 });

//                 logger.info(`Mensaje SMS enviado correctamente ${envioWhatsapp}`);

//                 logger.info('Pedido procesado con exito')
//                 respuesta.render('view/home', { carrito: carrito.productos });
//             } else {
//                 throw new Error("El carrito seleccionado no pertenece a tu usuario");
//             }

//         } else {
//             throw new Error("Debes estar autenticado para enviar pedidos");
//         }
//     } catch (error) {
//         next(error);
//     }
// }

export const controladorCarritos = {
    obtenerCarritoXid,
    crearCarrito,
    obtenerTodosProdsCarrito,
    guardarProdsCarrito,
    eliminarProdCarrito,
    eliminarCarritoXid,
    procesarPedido
};


// const emailUser = solicitud.user.email;
// const telefonoUser = solicitud.user.telefono;

// const pedido = await DaoCarrito.guardar(carrito);

// let mensaje = "El carrito contiene: "
// const pedidoCompra = pedido.forEach(producto => { mensaje += `${producto},` });

// logger.info({ mensaje });








// import { DaoCarrito, DaoProducto } from "../../Dao/index.js";
// import { FECHA_UTILS, ERRORES_UTILS } from "../../Utilidades/index.js";





// ruta.post("/compra", async (solicitud, respuesta) => {
//     try {
//         const carritoId = solicitud.usuario.carrito;

//         logger.info({ pedidoCompra, carritoId });

//         const carrito = await DaoCarrito.obtenerCarritoXid(carritoId);

//         if (!carrito) {
//             throw new Error('El carrito eleccionado no existe');
//         }
//         if (carrito == carrito.length === 0) logger.warn("El carrito seleccionado, todavia no tiene productos !!")


//         if (solicitud.estaAutenticado()) {
//             if (carrito.usuario.nombre === solicitud.user.nombre) {
//                 let mensaje = "El carrito contiene: "
//                 const pedidocompra = carrito.forEach(producto => { mensaje += `${producto},` });

//                 logger.info({ mensaje });

//                 servicioMensajeGmail.emailCompra();
//                 servicioMensajeSMS();

//                 respuesta.render('view/home', { pedidocompra });
//             } else {
//                 logger.warn('Error, el carrito este no es tu carrito');
//             }
//         } else {
//             throw new Error("Tenes estar autenticado para realizar pedidos de compra");
//         }
//     } catch (error) {
//         respuesta.send(`${error}, Error en Checkout`);
//     }
// });