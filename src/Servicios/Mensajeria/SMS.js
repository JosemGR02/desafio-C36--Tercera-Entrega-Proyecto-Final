
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Mensajeria SMS |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


import twilio from 'twilio';
import { config } from '../../Configuracion/config.js';
import { config } from '../../Configuracion/config.js';
import { usuario } from '../Passport/iniciar.js';


const client = twilio(config.WHATSAPP.ID_CUENTA, config.WHATSAPP.TOKEN_AUTHN)


const servicioMensajeSMS = async () => {
    try {
        const smsEnviado = await client.messages.create({
            body: "Su pedido ya ha sido recibido y esta en proceso",
            from: config.WHATSAPP.NRO_TWILIO,
            to: usuario.telefono,
        })
        logger.info(`Mensaje SMS enviado correctamente ${smsEnviado}`)
    } catch (error) {
        logger.error(error, 'Error en el envio del SMS')
    }
}

export default { servicioMensajeSMS };


