
const estaAutenticado = (solicitud, respuesta, next) => {
    if (solicitud.isAuthenticated())
        return respuesta.render("view/home", { email: solicitud.usuario.email });
    next()
}

export { estaAutenticado };

