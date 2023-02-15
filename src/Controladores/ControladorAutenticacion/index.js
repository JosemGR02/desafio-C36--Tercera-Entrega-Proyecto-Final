
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