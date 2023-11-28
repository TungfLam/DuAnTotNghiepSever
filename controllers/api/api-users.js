var md = require('../../models/user.model');
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
            if(objUser.password == password){
                msg = "Đăng nhập thành công"
                err = false;
            }else{
                msg = "Mật khẩu không chính xác"
            }
        }else{
            msg = "Tài khoản không tồn tại"
        }
    }

    res.status(200).json({
        msg : msg,
        err : err,
        idUser : (objUser._id != "") ? objUser._id : "",
        role : (objUser.role != "") ? objUser.role : "",
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


exports.addUser = async (req, res, next) => {
    try {
        const user = req.body;
        user.role = 'Staff';
        user.status = false;
        const newUser = md.userModel(user);
        await newUser.save();
        console.log(newUser);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

    res.json(objReturn);
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