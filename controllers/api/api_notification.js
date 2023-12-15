const mdNotification = require("../../models/notification.model");
const mdUser = require('../../models/user.model');

exports.getNotification = async (req , res ,next) =>{
    let idUser = req.params.idUser;
    let arrNotification = [];

    try {
        var objuser = await mdUser.userModel.findById(idUser);
    } catch (error) {
        console.log("User không tồn tại")
    }

    if(objuser){
        arrNotification = await mdNotification.notificationModel.find({id_user : idUser});
    }

    res.status(200).json(arrNotification);
}