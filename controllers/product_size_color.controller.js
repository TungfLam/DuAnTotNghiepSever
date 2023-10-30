const model_product_size_color = require('../models/product_size_color.model')
const productModel = require('../models/products.model');
const colorModel = require('../models/color.model')
const sizeModel = require('../models/sizes.model')
const categoriModel = require('../models/category.model')

const getListAll = async (req, res) => {
    const title = 'Product warehouse'

    try {
        const productListSizeColor = await model_product_size_color.product_size_color_Model.find().sort({ createdAt: -1 })
            .populate('product_id', "name price")
            .populate('category_id', "name")
            .populate('size_id', "name")
            .populate('color_id', "name")
        res.render('product_size_color/product_size_color', {
            title: title,
            productListSizeColor: productListSizeColor
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi truy vấn CSDL: ' + error.message });
    }
}

const delete_product_color_size = async (req, res) => {
    let id_product_color_size = req.params.id_product_color_size;
    console.log('id_product_color_size', id_product_color_size);
    await model_product_size_color.product_size_color_Model.findByIdAndDelete(id_product_color_size);
    res.redirect(`/product_size_color/getListAll`)
}



module.exports = { getListAll, delete_product_color_size }