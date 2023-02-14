
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Ruta Randoms |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import { Router } from 'express';
import { fork } from 'child_process';
import compression from 'compression';


const ruta = Router();  // Por ej: /?cantidad=20000


ruta.get("/:cantidad?", (solicitud, respuesta) => {
    try {
        const cantidadNumPedidos = solicitud.query.cantidad || 100000000; //probar con 500000000

        const subProceso = fork('./src/SubProceso-Fork/index.js');

        subProceso.send(Number(cantidadNumPedidos));

        subProceso.on('message', (resultadoUtils) => {
            console.log({ resultadoUtils })

            respuesta.render("view/randoms", { resultadoUtils })
        })
    } catch (error) {
        respuesta.send(error, 'Error en la ruta Randoms');
    }
})

export { ruta as RutaRandoms };



ruta.get("/bloq", compression(), (solicitud, respuesta) => {
    try {
        const datos = INFO_UTILS

        if (datos) return logger.info({ success: true, datos: datos })

        respuesta.render('view/info', { datos });
    } catch (error) {
        logger.error(error, 'Error al enviar la informacion: ');
    }
})