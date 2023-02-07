

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Ruta Autenticacion |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


import passport from "passport";
import { Router } from "express";
import { estaAutenticado } from "../../Middlewares/index.js";
import { logger } from '../../Configuracion/logger.js';
import { subirImg } from '../../app.js';
import { servicioMensajeWhatsapp, servicioGmailNuevoUser } from '../../Servicios/index.js';

const ruta = Router();


// Inicio/Home
ruta.get("/", estaAutenticado, (solicitud, respuesta) => {
    respuesta.render("view/login");
});

// Inicio Sesion
ruta.get("/login", estaAutenticado, (solicitud, respuesta) => {
    respuesta.render("view/login");
});

ruta.post("/login", passport.authenticate("login", { failureRedirect: "/api/autenticacion/error-login" }),
    (solicitud, respuesta) => {
        respuesta.redirect("/api/autenticacion");
    }
);


// Registrarse
ruta.get("/signup", estaAutenticado, (solicitud, respuesta) => {
    respuesta.render("view/signup");
});

ruta.post('/signup', passport.authenticate('signup', {
    successRedirect: '/api/autenticacion', failureRedirect: '/api/autenticacion/error-signup'
}), subirImg.single('avatar'), (solicitud, respuesta) => {
    try {
        const archivo = solicitud.file;
        logger.info(archivo);

        if (archivo) {
            respuesta.send({ status: 'imagen subida correctamente!', link: __dirname + '/uploads/' + archivo.nombreArchivo });
        } else {
            logger.error('Error al guardar la imagen')
        }
        servicioGmailNuevoUser();
        logger.info(`Mensaje enviado correctamente: Remitente: ${emailEnviado.from}, Destinatario: ${emailEnviado.to}, Asunto: ${emailEnviado.body}, Cuerpo: ${emailEnviado.body}`)

        servicioMensajeWhatsapp();
        logger.info(`Mensaje enviado correctamente: Remitente: ${whatsapp.from}, Destinatario: ${whatsapp.to}, Asunto: ${whatsapp.body}, Cuerpo: ${whatsapp.body}`)

        logger.info("Usuario registrado con exito")
    } catch (error) {
        respuesta.send(`${error}, Error en el Signup`);
    }
});


// Cerrar Sesion
ruta.get("/logout", (solicitud, respuesta) => {
    try {
        const { email } = solicitud.user;

        solicitud.logout(error => {
            if (error) {
                respuesta.send(`${error}, Error al desloguearse`);
            } else {
                respuesta.render('view/logout', { email });
            }
        });
    } catch (error) {
        respuesta.send(`${error}, Error en el logout`);
    }
});

// Rutas Errores
ruta.get("/error-login", (solicitud, respuesta) => {
    logger.error("Error en login")
    respuesta.render("view/error-login", {});
});

ruta.get("/error-signup", (solicitud, respuesta) => {
    logger.error("Error en signup")
    respuesta.render("view/error-signup", {});
});


export { ruta as RutAutenticacion };