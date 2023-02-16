
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Ruta Carrito Compra |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import { Router } from "express";
import { controladorCarritos } from '../../Controladores/index.js';


const ruta = Router();

ruta.get("/compra", (solicitud, respuesta) => {
    respuesta.render("view/cart");
});

ruta.post("/compra", controladorCarritos.procesarPedido);


export { ruta as RutaCarrito };
