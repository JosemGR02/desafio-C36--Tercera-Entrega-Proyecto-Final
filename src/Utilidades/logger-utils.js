
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Logger - Utils |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import { ContenedorFileSystem } from "../Contenedores/index.js";
import { FECHA_UTILS } from "./index.js";


const LoggerDao = new ContenedorFileSystem("logs");

const addLog = async (error) => {
    const log = { timestamp: FECHA_UTILS.getTimestamp(), message: error };
    await LoggerDao.guardar(log);
};

export const LOGGER_UTILS = { addLog };
