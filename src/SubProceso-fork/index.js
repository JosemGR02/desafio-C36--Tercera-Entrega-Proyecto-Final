
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Subproceso |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


import { RANDOMS_UTILS } from '../Utilidades/utils-randoms.js';

process.on('message', (cantidadNumPedidos) => {

    console.log(`cantidad: ${cantidadNumPedidos}`);
    const resultadoUtils = RANDOMS_UTILS.generadorNumRandoms(cantidadNumPedidos);

    process.send(resultadoUtils);
});

