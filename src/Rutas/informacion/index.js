

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Ruta Informacion |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


import compression from "compression";
import { Router } from "express";
import { INFO_UTILS } from "../../Utilidades/index.js";
import { logger } from '../../Configuracion/logger.js';


const ruta = Router();


ruta.get("/nobloq", compression(), (solicitud, respuesta) => {
    try {
        const datos = INFO_UTILS

        respuesta.render('view/info', { datos });

    } catch (error) {
        logger.error(error, 'Error al enviar la informacion: ');
    }
})

ruta.get("/bloq", compression(), (solicitud, respuesta) => {
    try {
        const datos = INFO_UTILS

        if (datos) return logger.info({ success: true, datos: datos })

        respuesta.render('view/info', { datos });
    } catch (error) {
        logger.error(error, 'Error al enviar la informacion: ');
    }
})

export { ruta as RutaInfo };






