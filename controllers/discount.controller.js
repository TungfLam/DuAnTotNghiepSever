let mdProduct_ = require('../models/product.model')
let mduser = require('../models/user.model')
let mddiscount = require("../models/discount.model")

const getAllDiscount = async (req, res) => {
    const aler = req.query.aler;
    const listUser = await mduser.userModel.find();
    const litsDiscount = await mddiscount.discountModel.find().sort({ createdAt: -1 });
    res.render('discount/list', {
        title: "ADADAS",
        heading: "Danh sách Voucher",
        message: "",
        listUser: listUser,
        litsDiscount: litsDiscount,
        message: aler
    });
}

const addDiscount = async (req, res) => {
    try {
        const { description, user, usageCount, price, voucherCode, end_day, start_day } = req.body;
        console.log("users =====>", user);
        // Tạo đối tượng discount từ discountModel
        // var date = moment(Date.now()).utc().toDate();
        // console.log('date: ' + date);
        const discount = new mddiscount.discountModel({
            description,
            user_id: user,
            start_day,
            end_day,
            usageCount,
            price,
            code_discount: voucherCode,
            createdAt: new Date(),

        });

        // Lưu đối tượng discount vào cơ sở dữ liệu
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


const deleteExpiredDiscounts = async () => {
    try {
        // Lấy tất cả các discount đã hết hạn
        const expiredDiscounts = await mddiscount.discountModel.find({
            end_day: { $lt: new Date() } // Lọc các bản ghi có end_day nhỏ hơn thời điểm hiện tại
        });
        console.log(' // Xóa các bản ghi đã hết hạn');
        await mddiscount.discountModel.deleteMany({
            end_day: { $lt: new Date() }
        });

        console.log('Đã xóa các discount đã hết hạn:', expiredDiscounts);
    } catch (error) {
        console.error('Lỗi khi xóa discount đã hết hạn:', error);
    }
};
setInterval(deleteExpiredDiscounts, 5 * 60 * 1000);

module.exports = { getAllDiscount, addDiscount, deleteDiscount }