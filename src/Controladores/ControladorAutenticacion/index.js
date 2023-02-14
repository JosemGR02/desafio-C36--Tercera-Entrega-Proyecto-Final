
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Controlador Autenticacion |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


import { transporter } from '../../Servicios/index.js';
import { logger } from '../../Configuracion/logger.js';
// import { subirImg } from '../../app.js';


const registro = async (solicitud, respuesta) => {
    try {
        const archivo = solicitud.file;
        const nuevoUsuario = solicitud.user;

        if (archivo) {
            respuesta.send({ status: 'imagen subida correctamente!', link: __dirname + '/uploads/' + archivo.nombreArchivo });
        } else {
            logger.error('Error al guardar la imagen');
        }
        logger.info(archivo);

        //envio msj de registro
        const envioEmail = {
            from: "Remitente",
            to: config.EMAIL.USUARIO,
            subject: `Nuevo registro, usuario: ${nuevoUsuario.nombre}, ${nuevoUsuario.email}`,
            text: `Hay un nuevo usuario registrado: ${nuevoUsuario.nombre}`
        };

        let info = transporter.sendMail(envioEmail, (error, info) => {
            if (error) {
                logger.error("Error al enviar mail: " + error);
            } else {
                logger.info("El email fue enviado correctamente: %s", info.messageId);
                logger.info("Vista previa a URL: %s", nodemailer.getTestMessageUrl(info));
            }
        });
        let informacion = transporter.sendMail(envioEmail, (error, info) => {
            if (error) {
                logger.error("Error al enviar mail: " + error);
            } else {
                logger.info("El email fue enviado correctamente: %s", informacion.messageId);
                logger.info("Vista previa a URL: %s", nodemailer.getTestMessageUrl(informacion));
            }
        });
    } catch (error) {
        respuesta.send(`${error}, Error en el Signup`);
    }
}

// subirImg.single('avatar'), (solicitud, respuesta) => {
//     try {
//         const archivo = solicitud.file;
//         const nuevoUsuario = solicitud.user;

//         if (archivo) {
//             respuesta.send({ status: 'imagen subida correctamente!', link: __dirname + '/uploads/' + archivo.nombreArchivo });
//         } else {
//             logger.error('Error al guardar la imagen');
//         }
//         logger.info(archivo);

//         //envio msj de registro
//         const envioEmail = {
//             from: "Remitente",
//             to: config.EMAIL.USUARIO,
//             subject: `Nuevo registro, usuario: ${nuevoUsuario.nombre}, ${nuevoUsuario.email}`,
//             text: `Hay un nuevo usuario registrado: ${nuevoUsuario.nombre}`
//         };

//         let info = transporter.sendMail(envioEmail, (error, info) => {
//             if (error) {
//                 logger.error("Error al enviar mail: " + error);
//             } else {
//                 logger.info("El email fue enviado correctamente: %s", info.messageId);
//                 logger.info("Vista previa a URL: %s", nodemailer.getTestMessageUrl(info));
//             }
//         });
//     } catch (error) {
//         respuesta.send(`${error}, Error en el Signup`);
//     }
// }

const desloguearse = async (solicitud, respuesta) => {
    try {
        const { email } = solicitud.user;

        solicitud.logout(error => {
            if (error) {
                respuesta.send(`${error}, Error al desloguearse`);
            } else {
                respuesta.render('view/logout', { email });
            }
        });
    } catch (error) {
        respuesta.send(`${error}, Error en el logout`);
    }
}


export const controladorAutenticacion = { registro, desloguearse };