
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Ruta Carrito Compra |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import { Router } from "express";
import { controladorCarritos } from '../../Controladores/index.js';


const ruta = Router();

ruta.get("/compra", (solicitud, respuesta) => { respuesta.render("view/cart") });
ruta.get("/:id", controladorCarritos.obtenerCarritoXid);
ruta.get("/:id/productos/", controladorCarritos.obtenerTodosProdsCarrito);

ruta.post("/", controladorCarritos.crearCarrito);
ruta.post("/:id", controladorCarritos.guardarProdsCarrito);
ruta.post("/compra", controladorCarritos.procesarPedido);

ruta.delete("/:id/productos/:id", controladorCarritos.eliminarProdCarrito);
ruta.delete("/:id", controladorCarritos.eliminarCarritoXid);


export { ruta as RutaCarrito };
