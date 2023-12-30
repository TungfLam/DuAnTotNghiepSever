let mdProduct_ = require('../models/product.model')
let mduser = require('../models/user.model')
let mddiscount = require("../models/discount.model")
const moment = require('moment-timezone');

const getAllDiscount = async (req, res) => {
    const aler = req.query.aler;
    const listUser = await mduser.userModel.find();
    let litsDiscount = await mddiscount.discountModel.find().sort({ createdAt: -1 });
    const lengthUser = listUser.length;
    console.log('litsDiscountlitsDiscount', litsDiscount);
    res.render('discount/list', {
        title: "ADADAS",
        heading: "Danh sách Voucher",
        message: "",
        listUser: listUser,
        lengthUser: lengthUser,
        litsDiscount: litsDiscount,
        message: aler
    });
}

const addDiscount = async (req, res) => {
    try {
        const { description, user, usageCount, price, voucherCode, end_day, start_day } = req.body;
        let users = []
        if (!user) {
            const listUsser = await mduser.userModel.find();
            listUsser.forEach(itemUser => {
                console.log('đẩy vào mảng');
                users.push(itemUser._id);
            });
        } 
        console.log('Đây là mảng users', users);
        const startDayVN = moment(start_day).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm');
        const endDayVN = moment(end_day).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm');

        const discount = new mddiscount.discountModel({
            description,
            user_id: !user ? users : user,
            start_day: startDayVN,
            end_day: endDayVN,
            usageCount,
            price,
            code_discount: voucherCode,
            createdAt: new Date(),
        });
        await discount.save();
        res.redirect(`/discount/?aler=Thêm thành công`);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server nội bộ.' });
    }
};
const deleteDiscount = async (req, res) => {
    try {
        const discountId = req.params.id;
        if (!discountId) {
            return res.status(400).json({ message: 'ID voucher không hợp lệ.' });
        }
        const existingDiscount = await mddiscount.discountModel.findById(discountId);
        if (!existingDiscount) {
            return res.status(404).json({ message: 'Voucher không tồn tại.' });
        }
        await mddiscount.discountModel.findByIdAndDelete(discountId);
        res.redirect(`/discount/?aler=Xóa thành công`);
    } catch (error) {
        console.error('Lỗi khi xóa voucher:', error);
        res.status(500).json({ message: 'Lỗi server nội bộ.' });
    }
};


module.exports = { getAllDiscount, addDiscount, deleteDiscount };


// const deleteExpiredDiscounts = async () => {
//     try {
//         // Lấy tất cả các discount đã hết hạn
//         const expiredDiscounts = await mddiscount.discountModel.find({
//             end_day: { $lt: new Date() } // Lọc các bản ghi có end_day nhỏ hơn thời điểm hiện tại
//         });
//         console.log(' // Xóa các bản ghi đã hết hạn');
//         await mddiscount.discountModel.deleteMany({
//             end_day: { $lt: new Date() }
//         });

//         console.log('Đã xóa các discount đã hết hạn:', expiredDiscounts);
//     } catch (error) {
//         console.error('Lỗi khi xóa discount đã hết hạn:', error);
//     }
// };
// setInterval(deleteExpiredDiscounts, 5 * 60 * 1000);

module.exports = { getAllDiscount, addDiscount, deleteDiscount }