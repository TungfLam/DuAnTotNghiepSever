const { nextTick } = require('process');
var md = require('../../models/user.model');
var fs = require('fs');
var objReturn = {
    status: 1,
    msg: 'OK'
}

exports.listUser = async (req, res, next) => {
    let list = [];

    try {
        list = await md.userModel.find();
        if (list.length > 0)
            objReturn.data = list;
        else {
            objReturn.status = 0;
            objReturn.msg = 'Không có dữ liệu phù hợp';
        }

    } catch (error) {
        objReturn.status = 0;
        objReturn.msg = error.message;
    }

    res.json(objReturn);
}
exports.userLogin = async (req, res, next) => {
    let msg = "";
    let err = true;
    let objUser;
    
    if(req.method == 'POST'){
        let sUsername = req.body.Username;
        let password = req.body.Password;

        if(!isNaN(sUsername)){
            objUser = await md.userModel.findOne({phone_number : sUsername})
        }else if(sUsername.split('@').length >= 2){
            objUser = await md.userModel.findOne({email : sUsername});
        }else{
            objUser = await md.userModel.findOne({username : sUsername});
        }

        if(objUser){
            if(objUser.status){
                if(objUser.password == password){
                    msg = "Đăng nhập thành công"
                    err = false;
                }else{
                    msg = "Mật khẩu không chính xác"
                }
            }else{
                msg = "Tải khoản đã bị khóa"
            }
            
        }else{
            msg = "Tài khoản không tồn tại"
        }
    }else{
        msg = "err method : vui lòng dùng method POST"
    }

    res.status(200).json({
        msg : msg,
        err : err,
        idUser : objUser != null ? objUser._id : "",
        role : objUser != null ? objUser.role : "",
        avata : objUser != null ? objUser.avata : "",
        phone : objUser != null ? objUser.phone_number : "",
        email : objUser != null ? objUser.email : "",
        fullname : objUser != null ? objUser.full_name : "",
    });
}

exports.userLoginPhone = async (req , res , next) => {
    let msg = "";
    let err = true;
    let objUser;

    if(req.method == 'POST'){
        let phone = req.body.Phone;
        try {
            objUser = await md.userModel.findOne({phone_number : phone});
        } catch (error) {
            console.log("Số điện thoại chưa đăng ký");
        }

        if(objUser){
            if(objUser.status){
                msg = "Đăng nhập thành công";
                err = false;
            }else{
                msg = "Tài khoản đã bị khóa";
            }
            
        }else{
            msg = "Số điện thoại chưa đăng ký";
        }

    }else{
        msg = "err method : vui lòng dùng method POST";
    }

    res.status(200).json({
        msg : msg,
        err : err,
        idUser : objUser != null ? objUser._id : "",
        role : objUser != null ? objUser.role : "",
        avata : objUser != null ? objUser.avata : "",
        phone : objUser != null ? objUser.phone_number : "",
        email : objUser != null ? objUser.email : "",
        fullname : objUser != null ? objUser.full_name : "",
    });
}

exports.setToken = async (req , res , next) => {
    let msg = "";
    let err = true;
    let objUser;

    if(req.method == 'PUT'){
        let idUser = req.params.idUser;
        let token = req.body.token;
        let deviceId = req.body.deviceId;
        
        try {
            objUser = await md.userModel.findById(idUser);
        } catch (error) {
            console.log("tài khoản không tồn tại");
        }

        if(objUser){
            objUser.token = token;

            if(objUser.deviceId == deviceId){
                err = false;
            }else if(objUser.deviceId == "" || !objUser.deviceId){
                objUser.deviceId = deviceId;
                try {
                    await md.userModel.findByIdAndUpdate(idUser , objUser);
                    msg = "update thành công";
                    err = false;
                } catch (error) {
                    msg = "update thất bại";
                }
            }else{
                objUser.deviceId = deviceId;
                try {
                    await md.userModel.findByIdAndUpdate(idUser , objUser);
                    msg = "đăng nhập thiết bị 2";
                    err = false;
                } catch (error) {
                    msg = "update thất bại";
                }
            }
        }else{
            msg = "Tài khoản không tồn tại";
        }
    }else{
        msg = "err method : vui lòng dùng method PUT"
    }

    res.status(200).json({
        msg : msg,
        err : err
    });
}

exports.checkLogin = async (req , res , next) => {
    let msg = "";
    let err = true;
    let objUser;

    if(req.method == 'POST'){
        let idUser = req.params.idUser;
        let deviceId = req.body.deviceId;

        try {
            objUser = await md.userModel.findById(idUser);
        } catch (error) {
            console.log("tài khoản không tồn tại");
        }

        if(objUser){
            if(objUser.status){
                if(objUser.deviceId == deviceId){
                    msg = "Đã đăng nhập";
                    err = false;
                }else{
                    msg = "Tài khoản đã đăng nhập ở lơi khác"
                }
            }else{
                msg = "Tài khoản đã bị khóa";
            }
        }else{
            msg = "Tài khoản không tồn tại";
        }
    }else{
        msg = "err method : vui lòng dùng method POST"
    }

    res.status(200).json({
        msg : msg,
        err : err
    });
}

exports.changePassword = async (rep , res , next) => {
    let msg = "";
    let err = true;

    try {
        var idUser = rep.params.idUser;
        var password = rep.body.password;
        var newPassword = rep.body.newPassowrd;
        var objUser = await md.userModel.findById(idUser);
    } catch (error) {
        console.log("User không tồn tại");
    }

    if(objUser){
        if(objUser.password == ""){
            msg = "Tải khoàn chưa có mật khẩu"
        }else{
            if(objUser.password == password){
                objUser.password = newPassword;
                try {
                    await md.userModel.findByIdAndUpdate(idUser , objUser);
                    msg = "Thay đổi mật khẩu thành công"
                    err = false;
                } catch (error) {
                    msg = "Không thành công, vui lòng thử lại sau";
                    console.log("change passwor : " + error);
                }
            }else{
                msg = "Mật khẩu không chính xác";
            }
        }
    }else{
        msg = "Tài khoàn không tồn tại";
    }

    res.status(200).json({
        msg : msg,
        err : err
    })
}

exports.addMethodLogin2 = async (req , res , next) => {
    let msg = "";
    let err = true;

    try {
        var idUser = rep.params.idUser;
        var username = req.body.username;
        var password = req.body.password;
        var objUser = await md.userModel.findById(idUser);

        var objUser2;
        if(username.split('@').length >= 2){
            objUser2 = await md.userModel.findOne({email : username});
            objUser.email = username;
        }else{
            objUser2 = await md.userModel.findOne({username : username});
            objUser.username = username;
        }
        
    } catch (error) {
        console.log(error);
    }

    if(objUser){
        if(objUser.password != ""){
            msg = "Mật khẩu đã được tạo"
        }else{
            if(objUser2){
                msg = "Username/email đã được sử dụng";
            }else{
                objUser.password = password;

                try {
                    await md.userModel.findByIdAndUpdate(idUser , objUser);
                    msg = "Thêm thành công";
                    err = false;
                } catch (error) {
                    msg = "Thêm thất bại, vui lòng thử lại sau"
                }
            }
        }
    }else{
        msg = "Tài khoàn không tồn tại";
    }

    res.status(200).json(
        {
            msg : msg,
            err : err
        }
    )
}

exports.logout = async (req , res , next) => {
    let msg = "";
    let err = true;
    let objUser;

    if(req.method == 'POST'){
        let idUser = req.params.idUser;

        try {
            objUser = await md.userModel.findById(idUser);
        } catch (error) {
            console.log("tài khoản không tồn tại");
        }

        if(objUser){
            objUser.token = "";
            objUser.deviceId = "";
            try {
                await md.userModel.findByIdAndUpdate(idUser , objUser);
                msg = "Logout thành công";
                err = false;
            } catch (error) {
                msg = "Logout thất bại";
            }
        }else{
            msg = "Tài khoản không tồn tại";
        }
        
    }else{
        msg = "err method : vui lòng dùng method POST"
    }

    res.status(200).json({
        msg : msg,
        err : err
    });
}

exports.addUser = async (req, res, next) => {
    let msg = "";
    let err = true;
    let objUser = new md.userModel();

    if(req.method == 'POST'){
        let phone = req.body.Phone;
        let fullname = req.body.Fullname;
        let email = req.body.Email;
        let password = req.body.Password;
        let token = req.body.Token;
        let deviceId = req.body.DeviceId;

        objUser.full_name = fullname;
        objUser.phone_number = phone;
        objUser.role = "User";
        objUser.status = true;
        objUser.token = token;
        objUser.deviceId = deviceId;

        objUser.email = email;
        objUser.password = password;

        if(req.file){
            try {
                fs.renameSync(req.file.path, './public/avatas/' + objUser._id + '_' + req.file.originalname);
                objUser.avata = '/avatas/' + objUser._id + '_' + req.file.originalname;
            } catch (error) {
                console.log("Ảnh bị lỗi rồi: "+error);
            }
        }

        try {
            var objUserPhone = await md.userModel.findOne({phone_number : phone});
            if(String(email) != ""){
                var objUserEmail = await md.userModel.findOne({email : email});
            }else{
                var objUserEmail = false;
            }
            
        } catch (error) {
            console.log(error);
        }
        
        if(objUserPhone){
            msg = "Số điện thoại đã được đăng ký";
        }else if(objUserEmail){
            msg = "Email đã được đăng ký";
        }else{
            try {
                await objUser.save();
                msg = "Tạo tài khoản thành công";
                err = false;
            } catch (error) {
                msg = "Tạo tài khoản thất bại";
                console.log(error);
            }
        }
    }else{
        msg = "err method : vui lòng dùng method POST"
    }

    res.status(200).json({
        msg : msg,
        err : err,
        idUser : (objUser != null) ? objUser._id : "",
        role : (objUser != null) ? objUser.role : ""
    });
}


exports.pagination = async (req, res, next) => {
    const PAGE_SIZE = 5;

    var page = req.query.page
    if (page) {
        page = parseInt(page)
        if (page < 1) {
            page = 1
        }
        var soLuongBoQua = (page - 1) * PAGE_SIZE

        md.userModel.find({})
            .skip(soLuongBoQua)
            .limit(PAGE_SIZE)
            .then(data => {
                res.json({
                    data,
                    PAGE_SIZE,
                    soLuongBoQua,
                    page,
                });
            })
            .catch(err => {
                catchError();
            })
    } else {
        md.userModel.find({})
            .then(data => {
                res.json(data);
            })
    }
}

async function catchError(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    const details = err.details;

    res.status(statusCode).json({
        message,
        details,
    });
}


exports.updateUser = async (req, res, next) => {

    const user = await md.userModel.findById(req.params.idu);
    if (!user) {
        res.status(404).send('User not found');
        return;
    }
    // Kiểm tra xem dữ liệu có hợp lệ hay không
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).send('Invalid data');
        console.log('Dữ liệu không đúng');

        return;
    }
    // Gọi API update user
    const updatedUser = await md.userModel.findByIdAndUpdate(req.params.idu, req.body, { new: true });
    console.log(updatedUser);
    res.json(objReturn);
}
exports.deleteUser = async (req, res, next) => {

    try {
        const user = await md.userModel.findByIdAndDelete(req.params.idu);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

    res.json(objReturn);
};

// address

exports.getAddressByIdUser = async (req , res , next) => {
    let idUser = req.params.idUser;
    let arrAddres = [];

    if(idUser != null){
        arrAddres = await md.addressModel.find({user_id : idUser});
    }else{
        console.log("idUser null");
    }

    res.status(200).json(arrAddres);
}

exports.addAddress = async (req , res , next) => {
    let msg = "";
    let err = true;

    if(req.method == 'POST'){
        let idUser = req.body.idUser;
        let address = req.body.address;
        let specificAddres = req.body.specificAddres;
        let objAddress = new md.addressModel();
        let objUser;

        try {
            objUser = await md.userModel.findById(idUser);
        } catch (error) {
            console.log("user khoong tồn tại");
        }

        if(objUser){

            let countAddress = await md.addressModel.find({user_id : idUser}).count();
            if(countAddress >= 3){
                msg = "Đã vượt quá số lượng địa chỉ";
            }else{
                if(address != "" || specificAddres != "" || address != null || specificAddres != null){
                    objAddress.user_id = idUser;
                    objAddress.address = address;
                    objAddress.specific_addres = specificAddres;
                    objUser.address = objAddress._id;
    
                    try {
                        await md.userModel.findByIdAndUpdate(idUser , objUser);
                        await objAddress.save();
                        msg = "Thêm thành công";
                        err = false;
                    } catch (error) {
                        msg = "Thêm địa chỉ thất bại";
                    }
                }else{
                    msg = "Chưa nhập đủ các trường"
                }
            }

        }else{
            msg = "Người dùng không tồn tại";
        }
    }else{
        msg = "err method : vui lòng dùng method POST"
    }

    res.status(200).json({
        msg : msg,
        err : err
    });
}

exports.updateAddres = async (req , res , next) => {
    let msg = "";
    let err = true;

    if(req.method == 'PUT'){
        let idAddress = req.params.idAddress;
        let address = req.body.address;
        let specificAddres = req.body.specificAddres;

        let objAddress;
        let objUser;
        try {
            objAddress = await md.addressModel.findById(idAddress);
            objUser = await md.userModel.findById(objAddress.user_id);
        } catch (error) {
            console.log("address or user Không tồn tại");
        }

        if(!objAddress){
            msg = "Địa chỉ không tồn tại";
        }else if(!objUser){
            msg = "Người dùng không tồn tại"
        }else{
            objAddress.address = address;
            objAddress.specific_addres = specificAddres;

            try {
                await md.addressModel.findByIdAndUpdate(idAddress , objAddress);
                msg = "Sửa địa chỉ thành công";
                err = false;
            } catch (error) {
                msg = "Sửa địa chỉ thất bại";
            }
        }
    }else{
        msg = "err method : vui lòng dùng method PUT"
    }

    res.status(200).json({
        msg : msg,
        err : err
    });
}

exports.deleteAddress = async (req , res , next) => {
    let msg = "";
    let err = true;

    if(req.method == 'DELETE'){
        let idAddress = req.params.idAddress;
        let objAddress;
        try {
            objAddress = await md.addressModel.findById(idAddress);
        } catch (error) {
            console.log("địa chỉ không tồn tại");
        }

        if(objAddress){
            let countAddress = await md.addressModel.find({user_id : objAddress.user_id}).count();
            if(countAddress <= 1){
                msg = "Bạn phải có tối thiểu một địa chỉ";
            }else{
                try {
                    await md.addressModel.findByIdAndDelete(idAddress);
                    msg = "Xóa địa chỉ thành công";
                    err = false;
                } catch (error) {
                    msg = "Xóa địa chỉ thất bại";
                }
            }
        }else {
            msg = "Địa chỉ không tồn tại";
        }
    }else{
        msg = "err method : vui lòng dùng method DELETE"
    }

    res.status(200).json({
        msg : msg,
        err : err
    });
}