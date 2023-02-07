
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Mensajeria Gmail |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import { createTransport } from 'nodemailer';
import { config } from '../../Configuracion/config.js';
import { usuario } from '../Passport/iniciar.js';



const transportador = createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.EMAIL.USUARIO,
        pass: config.EMAIL.CONTRASEÑA
    },
})


const servicioGmailNuevoUser = async () => {
    try {
        const emailOpciones = {
            from: "Mensajeria Gmail - Servidor Node.js",
            to: config.EMAIL.USUARIO,
            subject: `Nuevo usuario registrado: ${usuario}`,
            html: `<h1 style="color: blue;">Contenido de prueba de mensajeria con Gmail <span style="color: green;"> Proyecto node.js - Nodemailer</span></h1>`,
            attachments: [
                {
                    path: "nodemailer.png",
                },
            ],
        };

        const emailEnviado = await transportador.sendMail(emailOpciones)
        logger.info(`El email (registro usuario) fue enviado correctamente, ${emailEnviado}`)

    } catch (error) {
        logger.error(error, 'Error en el envio del Gmail')
    }
}

const servicioGmailCompra = async () => {
    try {
        const emailOpciones = {
            from: "Mensajeria Gmail - Servidor Node.js",
            to: config.EMAIL.USUARIO,
            subject: `${usuario.carrito}, Nuevo pedido de: ${usuario.nombre}, ${usuario.email}`,
            html: `<h1 style="color: blue;">Contenido de prueba de mensajeria con Gmail <span style="color: green;"> Proyecto node.js - Nodemailer</span></h1>`,
            attachments: [
                {
                    path: "nodemailer.png",
                },
            ],
        };

        const emailEnviado = await transportador.sendMail(emailOpciones)
        logger.info(`El email (compra) fue enviado correctamente, ${emailEnviado}`)

    } catch (error) {
        logger.error(error, 'Error en el envio del Gmail')
    }
}

export default { servicioGmailCompra, servicioGmailNuevoUser };







