
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Ruta Carrito Compra |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import { Router } from "express";
import { controladorCarritos } from '../../Controladores/index.js';


const ruta = Router();

ruta.get("/compra", (solicitud, respuesta) => { respuesta.render("view/cart") });
ruta.get("/:_id", controladorCarritos.obtenerCarritoXid);
ruta.get("/:_id/productos/", controladorCarritos.obtenerTodosProdsCarrito);

ruta.post("/", controladorCarritos.crearCarrito);
ruta.post("/:_id", controladorCarritos.guardarProdsCarrito);
ruta.post("/compra/:_id", controladorCarritos.procesarPedido);

ruta.delete("/:_id", controladorCarritos.eliminarCarritoXid);
ruta.delete("/:_id/productos/", controladorCarritos.eliminarProdCarrito);


export { ruta as RutaCarrito };
