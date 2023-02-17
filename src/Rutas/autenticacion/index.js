
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Ruta Autenticacion |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import passport from "passport";
import { Router } from "express";
import { estaAutenticado } from "../../Middlewares/index.js";
import { logger } from '../../Configuracion/logger.js';
import { subirImg } from '../../Utilidades/index.js';
import { controladorAutenticacion } from "../../Controladores/index.js";

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

ruta.post("/signup", subirImg.single('avatar'), passport.authenticate("signup", {
    successRedirect: "/api/autenticacion",
    failureRedirect: "/api/autenticacion/error-signup"
}));

// , (solicitud, respuesta) => {
//     try {
//         const datosUsuario = solicitud.user;

//         if (datosUsuario) {
//             logger.error('No hay datos de usuario');
//         } else {
//             respuesta.render('view/home', { datosUsuario });
//         }
//     } catch (error) {
//         respuesta.send(`${error}, Error en el Signup`);
//     }
// }
// controladorAutenticacion.registro

// Cerrar Sesion
ruta.get("/logout", controladorAutenticacion.desloguearse);


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