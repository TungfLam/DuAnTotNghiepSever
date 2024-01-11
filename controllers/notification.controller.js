const admin = require('firebase-admin');
const mdUser = require('../models/user.model')

const serviceAccount = require('../models/appclientadadas-firebase-adminsdk-ulv8d-c6bdb71b26.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

exports.notification = async (req, res, next) => {
    let dieu_kien_loc = {
        $and : [
            {phone_number : { $exists : true , $ne : null , $ne : ""}},
            {token : {$exists : true , $ne : null, $ne : ""}}
        ]
    };
    let search = req.query.search;

    if(String(search) !== "undefined" && String(search) != ""){ 
        if(isNaN(search)){
            dieu_kien_loc.$and.push({full_name : {$regex : search}});
        }else{
            dieu_kien_loc.$and.push({phone_number : {$regex : search}});
        }
    }

    const listUser = await mdUser.userModel.find(dieu_kien_loc).filteredSelect().exec();

    res.render('notification', {
        title: 'Thông báo',
        heading: 'Thông báo',
        listUser:listUser,
        search : search,
      });

} 

exports.pustNotification = async (req , res , next) => {
    let title = req.body.title;
    let content = req.body.content;
    
    try {
        var image = req.body.textImage;
        var listTonken = req.body.listToken;

        if(listTonken){
            const message = {
                tokens : listTonken,
                notification : {
                    title : title,
                    body : content,
                },
            }
        
            admin.messaging().sendMulticast(message)
                .then((response) => {
                    console.log("thang cong");
                })
                .catch((error) => {
                    console.error('Error sending message:', error);
                });
        }
        
    } catch (error) {
        console.log("các trường trống");
    }
    
    res.status(200).json({
        msg: "gui thong bao"
    });
}