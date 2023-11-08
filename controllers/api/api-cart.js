var md = require('../../models/cart.model');
var objReturn = {
    status: 1,
    msg: 'OK'
}

// get
exports.listCart = async (req, res, next) => {
    let list = [];

    try {
        list = await md.cartModel.find();
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

        md.cartModel.find({})
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
        md.cartModel.find({})
            .then(data => {
                res.json(data);
            })
    }
}
// validate Cart
const Joi = require('joi');

const schema = Joi.object({
    user_id: Joi.string().required(),
    product_id: Joi.string().required(),
    quantity: Joi.number().integer().required(),
    status: Joi.string().required()
});
// add Cart 
exports.addCart = async (req, res, next) => {
    try {
        const validation = schema.validate(req.body);
        if (validation.error) {
            return res.status(400).json({ message: 'Validation Error', error: validation.error.details });
        }


        const cart = req.body;
        const newCart = md.cartModel(cart);
        await newCart.save();
        console.log(newCart);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error', error: err.toString() });
    }

    res.json(objReturn);
}
// Update Cart
exports.updateCart = async (req, res, next) => {
    try {
        const validation = schema.validate(req.body);
        if (validation.error) {
            return res.status(400).json({ message: 'Validation Error', error: validation.error.details });
        }

        const bill = req.body;
        const updatedCart = await md.cartModel.findByIdAndUpdate(req.params.id, bill, { new: true });
        if (!updatedCart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        console.log(updatedCart);
        res.json(updatedCart);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: 'Server Error', error: err.toString() });
    }
}


// Delete Cart
exports.deleteCart = async (req, res, next) => {
    try {
        const deletedCart = await md.cartModel.findByIdAndDelete(req.params.id);
        if (!deletedCart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        console.log(deletedCart);
        res.json({ message: 'Cart deleted', cart: deletedCart });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: 'Server Error', error: err.toString() });
    }
}
