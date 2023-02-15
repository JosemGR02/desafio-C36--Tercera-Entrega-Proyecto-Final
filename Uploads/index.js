
import passport from "passport";
import { Router } from "express";
import { estaAutenticado } from "../../Middlewares/index.js";

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
}));


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
    console.log("Error en login")
    respuesta.render("view/error-login", {});
});

ruta.get("/error-signup", (solicitud, respuesta) => {
    console.log("Error en signup")
    respuesta.render("view/error-signup", {});
});


export { ruta as RutAutenticacion };