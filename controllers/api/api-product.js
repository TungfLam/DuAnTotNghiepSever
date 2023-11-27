var md = require('../../models/product.model');
var mdcategory = require('../../models/category.model');
const multer = require('multer');
const upload = multer();
var objReturn = {
    status: 1,
    msg: 'OK'
}


exports.getProducts = async (req, res) => {
    const skip = parseInt(req.params.skip) || 1
    const category = req.params.category;
    const products = await md.productModel.find({ category_id: category })
        .populate('category_id', "name")
        .skip(skip - 1 )
        .limit(10)
        .sort({ createdAt: -1 });
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
        const category = req.query.category
        console.log(category);
        const findIdCate = await mdcategory.categoryModel.findOne({ name: category })
        const sortUpPrice = await md.productModel.find({category_id:findIdCate}).sort({ price: - 1 }).populate('category_id', "name");
        res.json({ message: 'sort up by price success', sortUpPrice: sortUpPrice });
    } catch (error) {
        console.log('đã xảy ra lỗi ', error);
    }


};
exports.sortDown = async (req, res) => {
    try {
        const category = req.query.category
        console.log(category);
        const findIdCate = await mdcategory.categoryModel.findOne({ name: category })

        const sortDownPrice = await md.productModel.find({category_id:findIdCate}).sort({ price: 1 }).populate('category_id', "name");
        res.json({ message: 'sort down by price success', sortDownPrice: sortDownPrice });
    } catch (error) {
        console.log('đã xảy ra lỗi ', error);
    }
};

exports.searchProduct = async (req,res)=>{
    try {
        const searchValues = req.query.searchValues.toLowerCase();
        const listProducts = await md.productModel.find({
            name: { $regex: new RegExp(searchValues, 'i') }, 
        });
        res.json({ message: 'search for success', listProducts: listProducts });
    } catch (error) {
        console.log('đã xảy ra lỗi ', error);
    }
}