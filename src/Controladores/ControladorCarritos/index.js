
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Controlador Carrito Compra |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import { transporter, client } from '../../Servicios/index.js';
import { logger } from '../../Configuracion/logger.js';
import { config } from '../../Configuracion/config.js';
// import { DaoCarrito } from '../../Dao/index.js';



const procesarPedido = async (solicitud, respuesta, next) => {
    try {
        const pedido = solicitud.body;

        logger.info({ pedido });

        // const id = solicitud.params.id;
        // const carrito = await DaoCarrito.obtenerCarritoXid(id);

        if (pedido.length === 0) logger.warn("El carrito seleccionado no tiene productos todavia")
        if (!pedido) {
            throw new Error('El carrito seleccionado no existe');
        }

        let mensaje = "El carrito contiene: "
        const pedidoCompra = pedido.forEach(producto => { mensaje += `${producto},` });

        logger.info({ mensaje });

        if (solicitud.isAuthenticated()) {
            if (solicitud.user.nombre) {  // carrito.usuario.nombre === solicitud.usuario.nombre 

                carrito.usuario.nombre = solicitud.user.nombre;
                carrito.usuario.email = solicitud.user.usuario;

                // envio Email
                let envioEmail = {
                    from: "Remitente",
                    to: config.EMAIL.USUARIO,
                    subject: `Nuevo pedido: ${pedidoCompra}, de: ${carrito.usuario.nombre}, ${carrito.usuario.email}`,
                    text: `Productos solicitados por el usuario: ${pedidoCompra}`
                };

                let info = transporter.sendMail(envioEmail, (error, info) => {
                    if (error) {
                        logger.error("Error al enviar mail: " + error);
                    } else {
                        logger.info("El email fue enviado correctamente: %s", info.messageId);
                        logger.info("Vista previa a URL: %s", nodemailer.getTestMessageUrl(info));
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
                    body: `Nuevo pedido: ${pedidoCompra}, de: ${carrito.usuario.nombre}, ${carrito.usuario.email}`,
                    from: config.WHATSAPP.NRO_TWILIO,
                    to: `whatsapp:${carrito.usuario.telefono}`
                });

                logger.info(`Mensaje SMS enviado correctamente ${envioWhatsapp}`);

                logger.info('Pedido procesado con exito')
                respuesta.render('view/home', { pedidoCompra });
            } else {
                throw new Error("El carrito seleccionado no pertenece a tu usuario");
            }

        } else {
            throw new Error("Debes estar autenticado para enviar pedidos");
        }
    } catch (error) {
        next(error);
    }
}

export const controladorCarritos = { procesarPedido };










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

