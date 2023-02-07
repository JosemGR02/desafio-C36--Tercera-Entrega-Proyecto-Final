
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Randoms Utils |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


const generadorNumRandoms = (cantidadNumPedidos) => {
    let numeros = [];
    for (let i = 0; i < cantidadNumPedidos; i++) {
        let randoms = Math.floor((Math.random() * 1000) + 1);
        numeros.push(randoms);
    }
    let repetidos = {};
    numeros.forEach((numero) => {
        repetidos[numero] = (repetidos[numero] || 0) + 1;
    });
    return repetidos;
}

export const RANDOMS_UTILS = { generadorNumRandoms };

