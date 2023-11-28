
let express = require('express');
let dateFormat = require('date-format')
let moment = require('moment')
var config = require('../config/default.json');
let mdBill = require('../models/bill.model')
let mdProduct = require('../models/product_size_color.model')
let mdCart = require('../models/cart.model')
function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}


let globalIdBill;

const create_payment_url = (req, res, next) => {
    var ipAddr =
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress; // đúng 

    var tmnCode = config.vnp_TmnCode
    var secretKey = config.vnp_HashSecret
    var vnpUrl = config.vnp_Url
    var returnUrl = config.vnp_ReturnUrl


    var date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');
    var orderId = dateFormat(date, 'HHmmss');
    let amount = req.body.amount;
    let idbill = req.params.idbill;
    globalIdBill = idbill;

    var orderInfo = '**Nap tien cho thue bao 0123456789. So tien 100,000 VND**'    // Thông tin mô tả nội dung thanh toá
    var orderType = req.body.orderType;  ////Mã danh mục hàng hóa. Mỗi hàng hóa sẽ thuộc một nhóm danh mục do VNPAY quy định. Xem thêm bảng Danh mục hàng hóa

    let locale = req.body.language;
    if (locale === null || locale === '') {
        locale = 'vn';
    }
    var currCode = 'VND';
    var vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;  /// số tiền thanh toán 
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;

    // if(bankCode !== null && bankCode !== ''){
    //     vnp_Params['vnp_BankCode'] = bankCode;
    // }
    vnp_Params = sortObject(vnp_Params);

    var querystring = require('qs');
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
    res.status(200).json({
        vnpUrl: vnpUrl,
    });
}


const vnpay_return = async (req, res, next) => {
    let vnp_Params = req.query;
    let idbill = globalIdBill;

    let secureHash = vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    let config = require('config');
    let tmnCode = config.get('vnp_TmnCode');
    let secretKey = config.get('vnp_HashSecret');

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex");

    if (secureHash === signed) {
        try {
            // thay đổi trạng thái bill

            const dat_hang_thanh_cong = 2;
            const da_dat_hang = 'ordered'
            const finBill = await mdBill.billModel.findById(idbill)
                .populate('cart_id')
            finBill.status = dat_hang_thanh_cong
            await finBill.save();

            // thay đổi trạng thái cart 
            const finCart = await mdCart.cartModel.findById(finBill.cart_id)
            finCart.status = da_dat_hang
            await finCart.save();

            // trừ số lướng sản phẩm
            const finProduct = await mdProduct.product_size_color_Model.findById(finBill.cart_id.product_id)
            finProduct.quantity -= finCart.quantity;
            await finProduct.save();
        } catch (error) {
            console.log(error);
        }
        res.render('order/success', {
            code: vnp_Params['vnp_ResponseCode']
        })
    } else {
        res.render('order/success', { code: '97' })
    }
}


module.exports = { create_payment_url, vnpay_return }