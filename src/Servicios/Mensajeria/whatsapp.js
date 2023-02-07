
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Mensajeria Whatsapp |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


import twilio from 'twilio';
import { logger } from '../../Configuracion/logger.js';
import { config } from '../../Configuracion/config.js';
import { usuario } from '../Passport/iniciar.js';

const client = twilio(config.WHATSAPP.ID_CUENTA, config.WHATSAPP.TOKEN_AUTHN)


const servicioMensajeWhatsapp = async () => {
    try {
        const whatsapp = await client.messages.create({
            body: `${usuario.carrito}, Nuevo pedido de: ${usuario.nombre}, ${usuario.email}`,
            from: config.WHATSAPP.NRO_TWILIO,
            to: config.WHATSAPP.NRO_ADMIN,
            // mediaUrl: ['https://fotografias-neox.atresmedia.com/clipping/cmsimages01/2015/11/26/CF444504-29E2-4906-BAF6-490E09C1C98E/98.jpg?crop=899,506,x0,y37&width=1900&height=1069&optimize=high&format=webply']
            // mediaUrl: ['http://localhost:8080/api/imgs/ ']
        })
        logger.info(`Mensaje de Whatsapp enviado correctamente ${whatsapp}`)
    }
    catch (error) {
        logger.error(error, 'Error en el envio del Whatsapp')
    }
}

export default { servicioMensajeWhatsapp };





// node app.js "+5492804304495" "ENVIO MENSAJE WHATSAPP"



// prueba artillery

// modo fork y cluster

// artillery quick --count 20 -n 50 "http://localhost:8080/api/autenticacion/bloq"


