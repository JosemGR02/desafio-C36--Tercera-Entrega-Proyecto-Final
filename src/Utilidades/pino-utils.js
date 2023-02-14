
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| PINO - Pretty Loggers - Utils |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


import pino from 'pino';
import pretty from 'pino-pretty';
import moment from 'moment';



export const logger = pino(

    {
        base: {
            pid: process.pid
        },
        timestamp: () => `, "Hora": "${moment().format()}"`
    },
    pretty()
)


