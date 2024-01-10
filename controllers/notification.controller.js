const admin = require('firebase-admin');

const serviceAccount = require('../models/appclientadadas-firebase-adminsdk-ulv8d-c6bdb71b26.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

exports.pustNotification = (req , res , next) => {

    const message = {
        token : "cA-FhTGxTi6mcjylbhVQ75:APA91bFEfSN8J8_JkZRwPXeNc7IzH4qa-hqluY0_J1ah8w8n3JWueyRLW46kMZaw93OoER9tmzuNYu-3jzFIbGINz91DjESAOziKZNCKp6muivT_S4kPff8QCULptjOvAC6RibzhtKO8",
        notification : {
            title : "duy ok",
            body : "test notificatiokjakldsjfklasjdfkljaskldfjkla\nádjfjdjfhhjkjjakljfjkajsdfjjd \nạdsfjkahdfjkajksdhfjkhajdfhjdfdfafdafdadfadfn",
        },
    }

    admin.messaging().send(message)
        .then((response) => {
            console.log("thang cong");
            res.status(200).send('Notifications sent successfully');
        })
        .catch((error) => {
            console.error('Error sending message:', error);
            res.status(500).send('Error sending notification');
        })
    
    // res.render('notification',
    //     {
    //         title : "Notification",
    //     }
    // )
} 