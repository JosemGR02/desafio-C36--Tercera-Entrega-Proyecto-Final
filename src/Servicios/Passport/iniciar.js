
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Servicio Passport |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { BCRYPT_VALIDADOR, ERRORES_UTILS } from '../../Utilidades/index.js';
import { DaoUsuario } from "../../Dao/index.js";
import { transporter } from '../../Servicios/index.js';
import { config } from '../../Configuracion/config.js';


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
    }));

    // Estrategia Registrarse
    passport.use("signup", new LocalStrategy({
        usernameField: 'email',
        passwordField: 'contraseña',
        passReqToCallback: true,
    }, async (solicitud, usuario, contraseña, done) => {
        try {
            const { nombre, usuario, contrasena, edad, telefono, direccion } = solicitud.body

            if (!nombre, !usuario, !contrasena, !edad, !telefono, !direccion) return done(null, false);

            const archivoImg = solicitud.file.path;

            if (archivoImg) {
                logger.info({ status: 'imagen subida correctamente!', link: __dirname + '/uploads/' + archivoImg.nombreArchivo });
            } else {
                logger.error('Error al guardar la imagen');
            }

            const usuarioYaExiste = await DaoUsuario.obtenerUno({ 'email': usuario });

            if (usuarioYaExiste) {
                logger.info('El usuario ya existe con el email de: ' + usuario); //usuario.email, usuario.nombre (probar)
                return done(null, false);
            } else {
                const nuevoUsuario = {
                    nombre: nombre,
                    email: usuario,
                    contraseña: BCRYPT_VALIDADOR.crearContraHash(contrasena),
                    edad: edad,
                    telefono: telefono,
                    direccion: direccion,
                    avatar: archivoImg,
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
                        logger.error("Error al enviar mail: " + error);
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
