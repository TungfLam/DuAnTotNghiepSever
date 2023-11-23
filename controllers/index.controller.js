const mUser = require('../models/user.model');
let title = 'Thống kê '
let heading = 'Biểu đồ thống kê'
exports.login = async (req , res , next) => {
    let msg = "";
    let typeErr = false;
    if(req.method == 'POST'){
        let Username = req.body.Username;
        let Password = req.body.Password;
        
        let objUser = await mUser.userModel.findOne({username : Username});

        if(objUser){
            if(objUser.password == Password){
                if(objUser.role != "User"){
                    if(objUser.status){
                        console.log("User " + objUser.username);
                        req.session.userLogin = objUser;
                        res.redirect('/users');
                    }else{
                        msg = "Tài khoản của bạn đã bị khóa";
                        typeErr = true;
                    }
                }else{
                    msg = "Tài khoản khách không thể đăng nhập vào wed";
                    typeErr = true;
                }
            }else{
                msg = "Mật khẩu không chính xác";
                typeErr =  true;
            }
        }else{
            msg = "Tài khoản không tồn tại";
            typeErr =  true;
        }
    }

    res.render('user/login',
        {
            title : title,
            heading:heading,
            msg : msg,
            typeErr : typeErr
        }
    )
}

exports.logout = async (req , res , next) => {
    req.session.destroy((err) => {
        if(err){
            console.error(err);
            return;
        }else{
            res.redirect('/login');
            return;
        }
    })
}