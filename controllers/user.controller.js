const mUser = require('../models/user.model');


exports.list = async (req , res , next) => {

    let dieu_kien_loc = null;

    let search = "";
    search = req.query.search;
    if(String(search) !== "undefined"){ 
        if(isNaN(search)){
            dieu_kien_loc = {username : {$regex : search}};
        }else{
            dieu_kien_loc = {phone_number : {$regex : search}};
        }
    }

    let listUser = await mUser.userModel.find(dieu_kien_loc).populate('address_id');
    
    res.render('user/listUser',{
        title : "user",
        listUser : listUser,
        search : search
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