const mUser = require('../models/user.model');

exports.list = async (req , res , next) => {

    let listUser = await mUser.userModel.find().populate('address_id');
    
    res.render('user/listUser',{
        title : "user",
        listUser : listUser
    });
}

exports.details = async (req , res , next) => {

    let objUser = await mUser.userModel.findById(req.params.id).populate('address_id');

    res.render('user/detailUser' ,{
        title : "Details User",
        objUser : objUser
    });
}

exports.add = async (req , res , next) => {
    let msg = '';

    if(req.method == "POST"){
        let username = req.body.username;
        let password = req.body.password;
        let rePassword = req.body.rePassword;
        let full_name = req.body.fullName;
        let address_id = req.body.address;
        let phone_number = req.body.phoneNumber;

        if(username == ''){

        }

        let objUser = new mUser.userModel();
    }
  
    res.render("user/addUser", {
        title : "Add User",
        msg : 'msg'
    });
}