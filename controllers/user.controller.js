const mUser = require('../models/user.model');
var fs = require('fs'); 

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

    let listUser = await mUser.userModel.find(dieu_kien_loc);
    
    res.render('user/listUser',{
        title : "user",
        listUser : listUser,
        search : search,
        role : req.session.userLogin.role
    });
}

exports.details = async (req , res , next) => {

    let objUser = await mUser.userModel.findById(req.params.id);

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
        let address = req.body.address;
        let phone_number = req.body.phoneNumber;

        let objUser = await mUser.userModel.findOne({username : username});
        let objUserPhone = await mUser.userModel.findOne({phone_number : phone_number});
        let objUserEmail;

        if(objUser){
            msg = "Username đã tồn tại";
        }else if(objUserPhone){
            msg = "Số điện thoại đã được đăng ký";
            console.log("sdt : " + objUserPhone.username);
        }else if(String(password).length < 8){
            msg = "Mật khẩu phải có 8 ký tự";
        }else if(password != rePassword){
            msg = "Xác nhận mật khẩu không chính xác"
        }else{
            let objNewUser = new mUser.userModel();
             
            objNewUser.username = username;
            objNewUser.password = password;
            objNewUser.full_name = full_name;
            objNewUser.address = address;
            objNewUser.phone_number = phone_number;
            objNewUser.role = "Staff";

            if(req.file){
                try {
                    fs.renameSync(req.file.path, './public/avatas/' + objNewUser._id + '_' + req.file.originalname);
                    objNewUser.avatar = '/avatas/' + objNewUser._id + '_' + req.file.originalname;
                
                } catch (error) {
                    console.log("Ảnh bị lỗi rồi: "+error);
                }
            }else{
                msg = "Không có ảnh";
            }

            try {
                await objNewUser.save();
                msg = 'Thêm thành công';
            } catch (error) {
                msg = "Lỗi lưu vào cơ sở dữ";
            }

        }

    }
  
    res.render("user/addStaff", {
        title : "Add Staff",
        msg : msg
    });
}

exports.lock = async (req , res , next) => {
    let idUser = req.params.idUser;
    let objUser = await mUser.userModel.findById(idUser);

    if(objUser){
        objUser.status = false;
        try {
            await mUser.userModel.findByIdAndUpdate(idUser , objUser);
            res.redirect('/users');
        } catch (error) {
            console.log(error);
        }
    }
}

exports.unLock = async (req , res , next) => {
    let idUser = req.params.idUser;
    let objUser = await mUser.userModel.findById(idUser);

    if(objUser){
        objUser.status = true;
        try {
            await mUser.userModel.findByIdAndUpdate(idUser , objUser);
            res.redirect('/users');
        } catch (error) {
            console.log(error);
        }
    }
}