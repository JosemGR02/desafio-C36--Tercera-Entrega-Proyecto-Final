
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Ruta Compra/Carrito |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


import { Router } from "express";
import { logger } from '../../Configuracion/logger.js';
import { servicioGmailCompra, servicioMensajeSMS } from '../../Servicios/index.js';


const ruta = Router();

ruta.post("/checkout", (solicitud, respuesta) => {
    try {
        const pedidoCompra = solicitud.body;
        logger.info({ pedidoCompra });

        if (pedidoCompra) {
            let mensaje = "El carrito contiene: "
            const carrito = pedidoCompra.forEach(producto => { mensaje += `${producto},` });
            logger.info({ mensaje });

            servicioGmailCompra();
            logger.info(`Mensajes enviados correctamente: Remitente: ${emailEnviado.from}, Destinatario: ${emailEnviado.to}, Asunto: ${emailEnviado.body}, Cuerpo: ${emailEnviado.body}`)
            servicioMensajeSMS();

            respuesta.render('view/home', { carrito });
        } else {
            logger.warn('Error, No se encontro el carrito');
        }
    } catch (error) {
        respuesta.send(`${error}, Error en Checkout`);
    }
});

export { ruta as RutaCarrito };
