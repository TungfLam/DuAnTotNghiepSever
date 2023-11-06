const model_product_size_color = require('../models/product_size_color.model')
const productModel = require('../models/product.model');
const colorModel = require('../models/color.model')
const sizeModel = require('../models/sizes.model')
const categoriModel = require('../models/category.model')


const getListAll = async (req, res) => {
    const title = 'Product warehouse'
    try {
        const productListSizeColor = await model_product_size_color.product_size_color_Model.find().sort({ createdAt: -1 })
            .populate('product_id', "name price")
            .populate('size_id', "name")
            .populate('color_id', "name")
        console.log(productListSizeColor);
        res.render('product_size_color/product_size_color', {
            title: title,
            productListSizeColor: productListSizeColor
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi truy vấn CSDL: ' + error.message });
    }
}
const add_product_size_color = async (req, res) => {
    const title = 'Product warehouse'
    const product = await productModel.productModel.find();
    const category = await categoriModel.categoryModel.find();
    const size = await sizeModel.sizeModel.find();
    const color = await colorModel.colorModel.find();
    let message = ""
    try {
        if (req.method == 'POST') {
            const { name, categories, size, color, quantity, selectedname } = req.body;
            const checkproduct = await productModel.productModel.findOne({ name: name });
            const checksizes = await sizeModel.sizeModel.findOne({ name: size });
            const checkcolors = await colorModel.colorModel.findOne({ name: color });
            if (selectedname) {
                message = "Vui lòng chọn đúng"
                res.redirect('/product_size_color/add_product_size_color');
            }

            const existingProduct = await model_product_size_color.product_size_color_Model.findOne({
                product_id: checkproduct._id,
                size_id: checksizes._id,
                color_id: checkcolors._id,
            });
            if (existingProduct) {
                existingProduct.quantity += parseInt(quantity);
                await existingProduct.save();
                message = "Updated successfully";
            } else {
                const checkproduct = await productModel.productModel.findOne({ name: name });
                const checksizes = await sizeModel.sizeModel.findOne({ name: size });
                const checkcolors = await colorModel.colorModel.findOne({ name: color });

                let obj_product_size_color = new model_product_size_color.product_size_color_Model({
                    product_id: checkproduct._id,

                    size_id: checksizes._id,
                    color_id: checkcolors._id,
                    quantity: quantity,
                });
                await obj_product_size_color.save();
                message = "Added successfully"
            }
        }


    } catch (error) {
        message = "Please choose the correct format"
    }
    res.render('product_size_color/add_product_size_color', {
        title: title,
        product: product,
        category: category,
        size: size,
        color: color,
        message: message
    });
}

const delete_product_color_size = async (req, res) => {
    let id_product_color_size = req.params.id_product_color_size;
    console.log('id_product_color_size', id_product_color_size);
    await model_product_size_color.product_size_color_Model.findByIdAndDelete(id_product_color_size);
    res.redirect(`/product_size_color/getListAll`)
}

const sortUp = async (req, res) => {
    try {
        const title = 'Product tăng warehouse'
        const sortUpPrice = await model_product_size_color.product_size_color_Model.find({}).sort({ price: 1 })
            .populate('product_id', "name price")
            .populate('category_id', "name")
            .populate('size_id', "name")
            .populate('color_id', "name")
        console.log('tăng');
        sortUpPrice.forEach((product) => {
            console.log('Price:', product.product_id.price);
        });
        res.render('product_size_color/product_size_color', {
            title: title,
            productListSizeColor: sortUpPrice
        })
    } catch (error) {
        console.log(error);
    }

}
const sortDown = async (req, res) => {
    try {
        const title = 'Product giảm warehouse'
        const sortDownPrice = await model_product_size_color.product_size_color_Model.find({}).sort({ price: -1 })
            .populate('product_id', "name price")
            .populate('category_id', "name")
            .populate('size_id', "name")
            .populate('color_id', "name")
        console.log('giảm');

        sortDownPrice.forEach((product) => {
            console.log('Price:', product.product_id.price);
        });

        res.render('product_size_color/product_size_color', {
            title: title,
            productListSizeColor: sortDownPrice
        })
    } catch (error) {
        console.log(error)
    }

}
const update_product_size_color = async (req, res) => {
    const title = 'Update Wearehouse'
    let message = '';
    const id_product_color_size = req.params.id_product_color_size
    const category = await categoriModel.categoryModel.find();
    const size = await sizeModel.sizeModel.find();
    const color = await colorModel.colorModel.find();
    let product_size_color = await model_product_size_color.product_size_color_Model
        .findById(id_product_color_size)
        .populate('product_id', "name price")
        .populate('category_id', "name")
        .populate('size_id', "name")
        .populate('color_id', "name");

    let productupdate = await productModel.productModel.findById(product_size_color.product_id._id)


    if (req.method == 'POST') {
        const { name, categories, size, color, quantity, price } = req.body;
        // console.log("pricepricepricepricepricepricepricev",price);
        productupdate.price = price;
        product_size_color.category_id = categories;
        product_size_color.size_id = size;
        product_size_color.color_id = color;
        product_size_color.quantity = quantity;
        await product_size_color.save();
        await productupdate.save();

        message = 'Updated successfully'
    }

    res.render('product_size_color/update_product_size_color', {
        title: title,
        message: message,
        category: category,
        size: size,
        color: color,
        product_size_color: product_size_color
    })

}

module.exports = { getListAll, delete_product_color_size, sortUp, sortDown, add_product_size_color, update_product_size_color }