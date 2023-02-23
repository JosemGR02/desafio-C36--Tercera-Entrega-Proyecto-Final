
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Controlador Carrito Compra |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import { config } from '../../Configuracion/config.js';
import { logger } from '../../Configuracion/logger.js';
import { transporter, client } from '../../Servicios/index.js';
import { FECHA_UTILS, ERRORES_UTILS } from "../../Utilidades/index.js";
import { DaoCarrito } from '../../Dao/index.js';



const procesarPedido = async (solicitud, respuesta, next) => {
    try {
        const carritoCheckbooks = solicitud.body;

        logger.info({ carritoCheckbooks });

        if (carritoCheckbooks.length === 0) logger.warn({ mensaje: ERRORES_UTILS.MESSAGES.ERROR_PRODUCTO })
        if (!carritoCheckbooks) {
            throw new Error({ mensaje: ERRORES_UTILS.MESSAGES.ERROR_CARRITO });
        }

        if (solicitud.isAuthenticated()) {

            const usuarioCarrito = solicitud.user;
            // solicitud.user.nombre || solicitud.user; =>

            // carrito.usuario.nombre
            // carrito.usuario.email
            // carrito.usuario.telefono
            // carrito.productos

            const carritoBase = { timestamp: FECHA_UTILS.getTimestamp(), usuario: {}, productos: [] };

            carritoBase.productos.push({ ...carritoCheckbooks.productos });

            // carritoBase.usuario.push(usuarioCarrito);
            carritoBase.usuario = usuarioCarrito;

            const carrito = await DaoCarrito.guardar(carritoBase);

            logger.info(`Carrito guardado con exito, ${carrito}`);

            if (carrito.usuario.nombre === solicitud.user.nombre) {

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
