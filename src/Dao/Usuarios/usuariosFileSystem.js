

import { ContenedorFileSystem } from "../../Contenedores/index.js";
import { config } from "../../Configuracion/config.js";


export class UsuariosFileSystem extends ContenedorFileSystem {
    constructor() {
        super(config.DATABASES.filesystem.USUARIOS_ARCHIVONOMBRE);
    }
}