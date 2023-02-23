
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Ruta Carrito Compra |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import { Router } from "express";
import { controladorCarritos } from '../../Controladores/index.js';


const ruta = Router();

ruta.get("/compra", (solicitud, respuesta) => {
    respuesta.render("view/cart");
});

ruta.post("/", controladorCarritos.crearCarrito);

ruta.get("/:id", controladorCarritos.obtenerCarritoXid);

ruta.post("/:id/productos", controladorCarritos.guardarProdsCarrito);

ruta.get("/:id/productos", controladorCarritos.obtenerTodosProdsCarrito);

ruta.post("/:id/productos/:id", controladorCarritos.eliminarProdCarrito);

ruta.post("/:id", controladorCarritos.eliminarCarritoXid);

ruta.post("/compra", controladorCarritos.procesarPedido);


export { ruta as RutaCarrito };
