
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Controlador Autenticacion |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


import { logger } from '../../Configuracion/logger.js';


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



// const desloguearse = async (solicitud, respuesta) => {
//     try {
//         if (solicitud.isAuthenticated()) {

//             const { usuario } = solicitud.user;

//             solicitud.logout(error => {
//                 if (error) {
//                     logger.error('Error al desloguearse');
//                 } else {
//                     respuesta.render('view/logout', { usuario });
//                 }
//             });
//         } else {
//             throw new Error("Debes estar autenticado para desloguearte");
//         }
//     } catch (error) {
//         respuesta.send(`${error}, Error en el logout`);
//     }
// }
