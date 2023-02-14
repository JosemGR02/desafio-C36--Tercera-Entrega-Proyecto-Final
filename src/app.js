
import express from 'express';
import mongoose from "mongoose";
import handlebars from 'express-handlebars';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import __dirname from "./dirname.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import cluster from 'cluster';
import _yargs from 'yargs';
import multer from 'multer';
import { hideBin } from 'yargs/helpers';
const yargs = _yargs(hideBin(process.argv));
import { INFO_UTILS } from './Utilidades/index.js';
import { RutaRandoms, RutAutenticacion, RutaInfo, RutaServidor, RutaProducto, RutaCarrito } from "./Rutas/index.js";
import { PassportAutenticacion } from './Servicios/index.js';
import { config } from './Configuracion/config.js';
import { logger } from './Configuracion/logger.js';
import { RutaInexistente } from './Middlewares/index.js'

const app = express();


const mongOptiones = { useNewUrlParser: true, useUnifiedTopology: true }

// Sesion Mongo
app.use(
    session({
        store: MongoStore.create({
            mongoUrl: process.env.BASEDATOS_MONGO_URL,
            dbName: process.env.BASEDATOS_MONGO_NOMBRE,
            mongOptiones,
            ttl: 600,
            collectionName: 'sesionesMC',
            autoRemove: 'native'
        }),
        secret: "secret",
        resave: false,
        saveUninitialized: true,
        rolling: false,
        cookie: {
            maxAge: 600000,
        },
    })
);

// Passport
PassportAutenticacion.iniciar()
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('/public'))
// app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/uploads'));

// app.use(express.static(path.join(__dirname + '/public')));

// Yargs
const args = yargs
    .default({
        modo: "FORK",
        puerto: 8080,
    })
    .alias({
        m: "modo",
        p: "puerto",
    })
    .argv;

export const PUERTO = config.SERVER.PUERTO || args.puerto

// const LOGGER = args.logger || DEV

// Motor de plantilla
app.engine("hbs", handlebars.engine({ extname: ".hbs", defaultLayout: "main.hbs" }));

app.set('view engine', 'hbs')
app.set('views', './public/Vistas');
// app.set('views', __dirname + "/Vistas");


// Rutas 
app.use('/api/', RutaServidor)
app.use('/api/info', RutaInfo)
app.use('/api/randoms', RutaRandoms)
app.use('/api/autenticacion', RutAutenticacion);

app.use('/api/carrito', RutaCarrito);
app.use('/api/productos', RutaProducto);
// app.use('/api/imgs', RutaInexistente)
app.use('/api/*', RutaInexistente)


// const upload = multer({ dest : './public/data/uploads/'}) 
// ./public/imgGuardadas/uploads

// Multer
const myStorage = multer.diskStorage({
    destination: (solicitud, file, cb) => {
        cb(null, 'uploads')  // tmp/my-uploads
    },
    filename: (solicitud, file, cb) => {
        const nombreArchivo = `${Date.now()}-${file.originalname}`
        cb(null, nombreArchivo);
    }
})

export const subirImg = multer({ storage: myStorage })
// multer({ dest: 'uploads/' })



// Modo de ejecucion 
if (process.env.MODO_CLUSTER == true) {  // args.modo == 'CLUSTER' 
    if (cluster.isPrimary) {
        logger.info('Ejecucion en Modo Cluster')
        logger.info(`Primario corriendo con el id: ${process.pid} -- Puerto ${args.puerto}`);

        for (let i = 0; i < INFO_UTILS.procesadoresdCpus; i++) {
            cluster.fork();
        }

        cluster.on('exit', worker => {
            logger.info(`El trabajador con el id:${worker.process.pid} ha finalizado.`, new Date().tolocaleString());
            cluster.fork();
        });
    } else {
        // Servidor
        app.listen(PUERTO, async () => {
            logger.info(`Servidor escuchando en el puerto: ${PUERTO}, Trabajador iniciado con el id: ${process.pid}`);
            try {
                await mongoose.connect(process.env.BASEDATOS_MONGO_URL, mongOptiones);
                logger.info("Conectado a Base de Datos Mongo");
            } catch (error) {
                logger.error(`Error en conexión de Base de datos: ${error}`);
            }
        })
        app.on("error", (error) => logger.error(`Error en servidor ${error}`));
    }
} else {
    logger.info('Ejecucion en Modo Fork')
    logger.warn(`Prueba implementada, xd`)
    // let fork = false
    // if (!fork) logger.error(`erororor`)

    // Servidor
    app.listen(PUERTO, async () => {
        logger.info(`Servidor escuchando en el puerto: ${PUERTO}, Trabajador iniciado con el id: ${process.pid}`);
        try {
            await mongoose.connect(process.env.BASEDATOS_MONGO_URL, mongOptiones);
            logger.info("Conectado a Base de Datos Mongo");
        } catch (error) {
            logger.error(`Error en conexión de Base de datos: ${error}`);
        }
    })
    app.on("error", (error) => logger.error(`Error en servidor ${error}`));
}















