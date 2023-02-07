
import { createTransport } from 'nodemailer';
import { config } from './config.js';

const transporter = createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.user,
        pass: config.password
    },
})

const mailOptions = {
    from: "Servidor Node.js con img",
    to: config.user,
    subject: "Mail de prueba desde Node.js",
    html: `<h1 style="color: blue;">Contenido de prueba de mensajeria con Gmail <span style="color: green;"> Testeo - Nodemailer</span></h1>`,
    attachments: [
        {
            path: "nodemailer.png",
        },
    ],
};

try {
    const info = await transporter.sendMail(mailOptions)
    console.log(info)
} catch (error) {
    console.log(error)
}