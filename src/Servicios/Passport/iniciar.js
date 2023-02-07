import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { BCRYPT_VALIDADOR, ERRORES_UTILS } from '../../Utilidades/index.js';
import { DaoUsuario } from "../../Dao/index.js";


const iniciar = () => {

    // Serializar 
    passport.serializeUser((usuario, done) => {
        done(null, usuario._id);
    });

    // Deserializar
    passport.deserializeUser(async (id, done) => {
        const usuario = await DaoUsuario.obtenerXid(id);
        done(null, usuario);
    });

    // Estrategias Locales

    // Estrategia Inicio sesion
    passport.use("login", new LocalStrategy({
        usernameField: 'email',
        passwordField: 'contraseña',
        passReqToCallback: true,
    }, async (solicitud, email, contraseña, done) => {
        try {
            const usuario = await DaoUsuario.obtenerUno({ 'email': email });
            if (!usuario) {
                logger.info("No se encontro el usuario con el email " + email);
                return done(null, false);
            }
            if (!BCRYPT_VALIDADOR.validarContraseña(usuario, contraseña)) {
                logger.info({ error: ERRORES_UTILS.MESSAGES.ERROR_USUARIO_O_CONTRA });
                return done(null, false)
            }

            return done(null, usuario);
        } catch (error) {
            logger.error(`${error}, Error en Passport - inicio Sesion`);
        }
    }))

    // Estrategia Registrarse
    passport.use("signup", new LocalStrategy({
        usernameField: 'email',
        passwordField: 'contraseña',
        passReqToCallback: true,
    }, async (solicitud, usuario, contraseña, done) => {
        try {
            const { nombre, usuario, contraseña, edad, telefono, direccion, avatar, carrito } = solicitud.body

            if (!nombre, !usuario, !contraseña, !edad, !telefono, !direccion, !avatar) return done(null, false);

            const usuarioYaExiste = await DaoUsuario.obtenerUno({ 'email': usuario });
            if (usuarioYaExiste) {
                logger.info('El usuario ya existe con el email de: ' + usuario); //usuario.email, usuario.nombre (probar)
                return done(null, false);
            } else {
                const nuevoUsuario = {
                    nombre: nombre,
                    email: usuario,
                    contraseña: BCRYPT_VALIDADOR.crearContraHash(contraseña),
                    edad: edad,
                    telefono: telefono,
                    direccion: direccion,
                    avatar: avatar,
                    carrito: carrito
                }
                const usuarioCreado = await DaoUsuario.guardar(nuevoUsuario)
                logger.info(`Usuario ${usuarioCreado} registrado correctamente`);

                return done(null, usuarioCreado);
            }
        } catch (error) {
            logger.error(`${error}, Error en Passport - Registro`);
        }
    }))
}

export const PassportAutenticacion = {
    iniciar,
}



// import { msjAdminGmail } from "../../Utilidades/mensajeria/index.js";
// import { msjclienteSMS } from "../../Utilidades/mensajeria/index.js";
// import { msjAdminWhatsapp } from "../../Utilidades/mensajeria/index.js";

// const NotificacionNuevoUsuario = {}

//     nombreUsuario



// msjAdminWhatsapp(usuarioCreado)

// msjAdminGmail(usuarioCreado)


// para whatsapp y gmail
// usuarioCreado.carrito

// msjclienteSMS()

// para sms
// usuarioCreado.telefono



