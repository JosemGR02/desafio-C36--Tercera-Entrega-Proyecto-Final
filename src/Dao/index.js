
import { config } from "../Configuracion/config.js";
import { servicioMongoDB } from "../Servicios/index.js";
import { CarritosMongoBD, CarritosFilesystem } from "./Carritos/index.js";
import { ProductosMongoBD, ProductosFileSystem } from "./Productos/index.js";
import { UsuariosMongoBD, UsuariosFileSystem } from "./Usuarios/index.js";


const obtenerDaoSeleccionados = () => {
  switch (config.SERVER.SELECCION_BASEdDATOS) {
    case "mongo": {
      servicioMongoDB.init();
      return {
        DaoUsuario: new UsuariosMongoBD(),
        DaoProducto: new ProductosMongoBD(),
        DaoCarrito: new CarritosMongoBD(),
      };
    }
    case "filesystem": {
      return {
        DaoUsuario: new UsuariosFileSystem(),
        DaoProducto: new ProductosFileSystem(),
        DaoCarrito: new CarritosFilesystem(),
      };
    }
  }
};

const { DaoProducto, DaoUsuario, DaoCarrito } = obtenerDaoSeleccionados();

export { DaoProducto, DaoUsuario, DaoCarrito };



