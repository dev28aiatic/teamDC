import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer'

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

//ssiguiendo video de: https://www.youtube.com/watch?v=MeXLkNWTF_g
export const datosEmail = functions.firestore.document("contactos/{id}").onCreate((snap,contex)=>{
    const email = snap.data().email;
    const nombre = snap.data().nombreCompleto;   
    const motivo =snap.data().motivo;
    const mensaje = snap.data().mensaje;

    return enviarCorreo(email,nombre,motivo,mensaje);

});

const transporte = nodemailer.createTransport({
    service: 'Gmail',
    auth:{user:'dev28@aiatic.com',
        pass:'#Karjai2020//'
    }
})

function enviarCorreo(email:string, nombre:string,motivo:string,mensaje:string){
    return transporte.sendMail({
        from:'Dc Team',
        to: 'dev24@aiatic.com',
        subject: 'nuevo contacto',
        html:`
            <h1> Nuevo registro de Contacto</h1>
            <p></p>
            <h3>${{nombre}}</h3>
            <h3>${{email}}</h3>
            <h3>${{motivo}}</h3>
            <p>${{mensaje}}</p>            
        `

    })
    .then((r: any)=> r) 
    .catch((e:any)=>e); 
}