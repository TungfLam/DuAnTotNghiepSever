var md = require('../../models/bill.model');
var objReturn = {
    status: 1,
    msg: 'OK'
}
const { DateTime } = require('luxon');

// get
exports.listBill = async (req, res, next) => {
    let list = [];

    try {
        list = await md.billModel.find();
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
// get theo id
exports.listBillByUserId = async (req, res, next) => {
    let userId = req.params.userId;
    let list = [];

    try {
        list = await md.billModel.find({ user_id: userId })
        .populate("user_id")
        
        .populate({
            path: 'cart_id',
            populate: {
                path: 'product_id',
                model: 'product_size_color_Model',
                populate: [
                    { path: 'product_id' },
                    { path: 'size_id' },
                    { path: 'color_id' }
                ]
            },
            
        })
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

// get có phân trang
exports.pagination = async (req, res, next) => {
    const PAGE_SIZE = 5;

    var page = req.query.page
    if (page) {
        page = parseInt(page)
        if (page < 1) {
            page = 1
        }
        var soLuongBoQua = (page - 1) * PAGE_SIZE

        md.billModel.find({})
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
        md.billModel.find({})
            .then(data => {
                res.json(data);
            })
    }
}
// validate bill
const Joi = require('joi');

const schema = Joi.object({
    user_id: Joi.string().required(),
    cart_id: Joi.string().required(),
    payments: Joi.number().integer().required(),
    total_amount: Joi.number().integer().required()
});
// add bill 
exports.addBill = async (req, res, next) => {
    try {
        const validation = schema.validate(req.body);
        if (validation.error) {
            return res.status(400).json({ message: 'Validation Error', error: validation.error.details });
        }


        const bill = req.body;
        bill.status = 1;
        bill.date = DateTime.now().setZone('Asia/Ho_Chi_Minh');
        const newBill = md.billModel(bill);
        await newBill.save();
        console.log(newBill);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error', error: err.toString() });
    }

    res.json(objReturn);
}
// Update Bill
exports.updateBill = async (req, res, next) => {
    try {
        const validation = schema.validate(req.body);
        if (validation.error) {
            return res.status(400).json({ message: 'Validation Error', error: validation.error.details });
        }

        const bill = req.body;
        bill.date = DateTime.now().setZone('Asia/Ho_Chi_Minh').toISO(); // Add current date in Vietnam
        const updatedBill = await md.billModel.findByIdAndUpdate(req.params.id, bill, { new: true });
        if (!updatedBill) {
            return res.status(404).json({ message: 'Bill not found' });
        }

        console.log(updatedBill);
        res.json(updatedBill);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: 'Server Error', error: err.toString() });
    }
}


// Delete Bill
exports.deleteBill = async (req, res, next) => {
    try {
        const deletedBill = await md.billModel.findByIdAndDelete(req.params.id);
        if (!deletedBill) {
            return res.status(404).json({ message: 'Bill not found' });
        }
        res.json({ message: 'Bill deleted' });
    } catch (err) {
        return res.status(500).json({ message: 'Server Error', error: err.toString() });
    }
}
