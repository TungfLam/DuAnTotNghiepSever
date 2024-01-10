const admin = require('firebase-admin');
const mdUser = require('../models/user.model')

const serviceAccount = require('../models/appclientadadas-firebase-adminsdk-ulv8d-c6bdb71b26.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

exports.pustNotification = async (req, res, next) => {

    const listUser = await mdUser.userModel.find();

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
        })
        .catch((error) => {
            console.error('Error sending message:', error);
        })


    res.render('notification', {
        title: 'Thông báo',
        heading: 'Thông báo',
        listUser:listUser
   
      });

} 