
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Controlador Autenticacion |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


import { logger } from '../../Configuracion/logger.js';


// const registro = async (solicitud, respuesta) => {
//     try {
//         const datosUsuario = solicitud.user;

//         if (datosUsuario) {
//             logger.error('No hay datos de usuario');
//         } else {
//             respuesta.render('view/logout', { datosUsuario });
//         }
//     } catch (error) {
//         respuesta.send(`${error}, Error en el Signup`);
//     }
// }

const desloguearse = async (solicitud, respuesta) => {
    try {
        const { email } = solicitud.user;

        solicitud.logout(error => {
            if (error) {
                logger.error('Error al desloguearse');
            } else {
                respuesta.render('view/logout', { email });
            }
        });
    } catch (error) {
        respuesta.send(`${error}, Error en el logout`);
    }
}


export const controladorAutenticacion = { desloguearse };



