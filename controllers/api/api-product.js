var md = require('../../models/product.model');
const multer = require('multer');
const upload = multer();
var objReturn = {
    status: 1,
    msg: 'OK'
}


exports.getProducts = async (req, res) => {
    const skip = req.params.skip;
    const limit = req.params.limit;
    console.log(skip);
    console.log(limit);
    const products = await md.productModel.find()
        .populate('category_id', "name").skip(skip).limit(limit).sort({ createdAt: -1 })
    res.json(products);
};
exports.createProduct = async (req, res) => {
    const { name, description, price, createdAt, updatedAt } = req.body;
    const image = req.files.map(file => file.buffer.toString('base64'));
    const product = new md.productModel({ name, description, image, price, createdAt, updatedAt });
    await product.save();
    res.json(product);
};

exports.updateProduct = async (req, res) => {
    const { name, description, price, createdAt, updatedAt } = req.body;
    const image = req.files.map(file => file.buffer.toString('base64'));
    const product = await md.productModel.findByIdAndUpdate(req.params.id, { name, description, image, price, createdAt, updatedAt }, { new: true });
    res.json(product);
};

exports.deleteProduct = async (req, res) => {
    await md.productModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
};

exports.sortUp = async (req, res) => {
    try {
        const sortUpPrice = await md.productModel.find({}).sort({ price: 1 }).populate('category_id', "name");
        res.json({ message: 'sort up by price success', sortUpPrice: sortUpPrice });
    } catch (error) {
        console.log('đã xảy ra lỗi ', error);
    }


};
exports.sortDown = async (req, res) => {
    try {
        const sortDownPrice = await md.productModel.find({}).sort({ price: -1 }).populate('category_id', "name");
        res.json({ message: 'sort down by price success', sortDownPrice: sortDownPrice });
    } catch (error) {
        console.log('đã xảy ra lỗi ', error);
    }
};


