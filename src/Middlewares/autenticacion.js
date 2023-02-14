
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Middleware Autenticacion |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


const estaAutenticado = (solicitud, respuesta, next) => {
    if (solicitud.isAuthenticated())
        return respuesta.render("view/home", { email: solicitud.user.email });
    next()
}

export { estaAutenticado };

