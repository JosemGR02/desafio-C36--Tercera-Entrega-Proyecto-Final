
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Config registrador PINO JS |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


import pino from 'pino';
import pretty from 'pino-pretty';
import moment from 'moment';


function crearLoggerProd() {
    const loggerProdWarn = pino('Warn.log', {
        base: { pid: process.pid },
        timestamp: () => `, "Hora": "${moment().format()}"`
    }, pretty())

    loggerProdWarn.level = 'warn'

    const loggerProdError = pino('Error.log', {
        base: { pid: process.pid },
        timestamp: () => `, "Hora": "${moment().format()}"`
    }, pretty())

    loggerProdError.level = 'error'

    return loggerProdWarn, loggerProdError
}

function crearloggerDev() {
    const loggerDEV = pino({
        base: { pid: process.pid },
        timestamp: () => `, "Hora": "${moment().format()}"`
    }, pretty())

    loggerDEV.level = 'info'

    return loggerDEV
}

export let logger = null

if (process.env.LOGGER_MODO === 'PROD') {
    logger = crearLoggerProd()
} else {
    logger = crearloggerDev()
}

