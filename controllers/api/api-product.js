var md = require('../../models/product.model');
const multer = require('multer');
const upload = multer();
var objReturn = {
    status: 1,
    msg: 'OK'
}


exports.getProducts = async (req, res) => {
    const products = await md.productModel.find();
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
