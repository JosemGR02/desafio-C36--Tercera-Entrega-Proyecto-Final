
import { Router } from 'express';
import { PUERTO } from '../../app.js';


const ruta = Router();


ruta.get('/', (solicitud, respuesta) => {
    const fecha = new Date().toLocaleDateString()
    respuesta.send(`Servidor express iniciado en el PUERTO: (${PUERTO}) -~- ENTREGA DESAFIO: Desplegar nuestro proyecto en la nube :) -~- PID: (${process.pid}) -~- FECHA: (${fecha})`)
})

export { ruta as RutaServidor };