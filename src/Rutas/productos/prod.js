
import { Router } from "express";
import { controladorProductos } from "../../Controladores/index.js";


const ruta = Router();


ruta.get("/", controladorProductos.obtenerTodos);

ruta.get("/:id", controladorProductos.obtenerXid);

ruta.post("/", controladorProductos.crearProducto);

ruta.put("/:id", controladorProductos.actualizar);

ruta.delete("/:id", controladorProductos.eliminarXid);

ruta.delete("/", controladorProductos.eliminarTodos);

export { ruta as RutaProducto };


