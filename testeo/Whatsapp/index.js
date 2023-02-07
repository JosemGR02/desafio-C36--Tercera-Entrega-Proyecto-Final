
import { config } from "./config.js";
import twilio from 'twilio';

const client = twilio(config.user, config.pass)
const msj = process.argv[3]

try {
    const mensaje = await client.messages.create({
        body: msj,
        from: config.number,
        to: 'whatsapp:+5492804304495',
        mediaUrl: ['https://fotografias-neox.atresmedia.com/clipping/cmsimages01/2015/11/26/CF444504-29E2-4906-BAF6-490E09C1C98E/98.jpg?crop=899,506,x0,y37&width=1900&height=1069&optimize=high&format=webply']
    })
    console.log({ mensaje })
}
catch (error) {
    console.log({ error })
}

// node servidor.js "+5492804304495" "envio mensaje con whatsapp"