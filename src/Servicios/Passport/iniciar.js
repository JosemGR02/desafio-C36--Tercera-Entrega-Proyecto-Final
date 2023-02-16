
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Servicio Passport |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import passport from "passport";
import __dirname from '../../dirname.js';
import { Strategy as LocalStrategy } from "passport-local";
import { BCRYPT_VALIDADOR, ERRORES_UTILS } from '../../Utilidades/index.js';
import { DaoUsuario } from "../../Dao/index.js";
import { transporter } from '../../Servicios/index.js';
import { config } from '../../Configuracion/config.js';
import { logger } from '../../Configuracion/logger.js';


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
        usernameField: 'usuario',
        passwordField: 'contrasena',
        passReqToCallback: true,
    }, async (solicitud, usuario, contrasena, done) => {
        try {
            const usuario = await DaoUsuario.obtenerUno({ 'email': usuario });
            if (!usuario) {
                logger.info("No se encontro el usuario con el usuario " + usuario);
                return done(null, false);
            }
            if (!BCRYPT_VALIDADOR.validarContraseña(usuario, contrasena)) {
                logger.info({ error: ERRORES_UTILS.MESSAGES.ERROR_USUARIO_O_CONTRA });
                return done(null, false)
            }

            return done(null, usuario);
        } catch (error) {
            logger.error(`${error}, Error en Passport - inicio Sesion`);
        }
    }));

    // Estrategia Registrarse
    passport.use("signup", new LocalStrategy({
        usernameField: 'usuario',
        passwordField: 'contrasena',
        passReqToCallback: true,
    }, async (solicitud, usuario, contrasena, done) => {
        try {
            const { nombre, usuario, contrasena, edad, telefono, direccion } = solicitud.body

            if (!nombre, !usuario, !contrasena, !edad, !telefono, !direccion) return done(null, false);

            const file = solicitud.file; //* solo me dejaba usando una const: solicitud.file sin .path

            logger.info({ status: 'imagen subida correctamente!', link: __dirname + '/public/Uploads/' + file.filename });

            const usuarioYaExiste = await DaoUsuario.obtenerUno({ 'email': usuario });

            if (usuarioYaExiste) {
                logger.info('El usuario ya existe con el email de: ' + usuario);
                return done(null, false);
            } else {
                const nuevoUsuario = {
                    nombre: nombre,
                    email: usuario,
                    contraseña: BCRYPT_VALIDADOR.crearContraHash(contrasena),
                    edad: edad,
                    telefono: telefono,
                    direccion: direccion,
                    avatar: solicitud.file.path,
                }
                const usuarioCreado = await DaoUsuario.guardar(nuevoUsuario)
                logger.info(`Usuario ${usuarioCreado} registrado correctamente`);

                // envio email al admin
                const envioEmail = {
                    from: "Remitente",
                    to: config.EMAIL.USUARIO,
                    subject: `Nuevo registro, usuario: ${usuarioCreado.nombre}, ${usuarioCreado.email}`,
                    text: `Hay un nuevo usuario registrado: ${usuarioCreado.nombre}`
                };

                let info = transporter.sendMail(envioEmail, (error, info) => {
                    if (error) {
                        logger.error("Error al enviar email: " + error);
                    } else {
                        logger.info("El email fue enviado correctamente: %s", info.messageId);
                        logger.info("Vista previa a URL: %s", nodemailer.getTestMessageUrl(info));
                    }
                });

                return done(null, usuarioCreado);
            }
        } catch (error) {
            logger.error(`${error}, Error en Passport - Registro`);
        }
    }));
}

export const PassportAutenticacion = {
    iniciar,
}
