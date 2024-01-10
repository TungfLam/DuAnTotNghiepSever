
const mdUser = require('../models/user.model')


exports.pustNotification = async (req, res, next) => {

const listUser = await mdUser.userModel.find();

    res.render('notification', {
        title: 'Thông báo',
        heading: 'Thông báo',
        listUser:listUser
   
      });
   
} 