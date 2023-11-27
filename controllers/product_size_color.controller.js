const model_product_size_color = require('../models/product_size_color.model')
const productModel = require('../models/product.model');
const colorModel = require('../models/color.model')
const sizeModel = require('../models/sizes.model')
const categoriModel = require('../models/category.model')
let heading = 'Danh sách kho hàng'
let title = 'Kho hàng'
const getListAll = async (req, res) => {
    let message = ''
    try {
        const page = parseInt(req.params.page) || 1;;
        const limit = 10;
        const startCount = (page - 1) * limit + 1;
        const productListSizeColor = await model_product_size_color.product_size_color_Model.find()
            .populate('product_id', "name price")
            .populate('size_id', "name")
            .populate('color_id', "name").skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 })

            console.log('productListSizeColor',productListSizeColor);
        const listproduct = await productModel.productModel.find()

        const countProducts = await model_product_size_color.product_size_color_Model.count();
        const countPages = Math.ceil(countProducts / limit);
        res.render('product_size_color/product_size_color', {
            title: title,
            heading: heading,
            message: '',
            productListSizeColor: productListSizeColor,
            listproduct: listproduct,
            startCount: startCount,
            countProducts: countProducts,
            countPages: countPages,
            page: page,
            selectedroductName: 'all'
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi truy vấn CSDL: ' + error.message });
    }
}
const add_product_size_color = async (req, res) => {
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
        heading: heading,
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

    res.redirect(`/product_size_color/getListAll/1`)
}

const sortUp = async (req, res) => {
    try {
        const sortUpPrice = await model_product_size_color.product_size_color_Model.find({}).sort({ price: 1 })
            .populate('product_id', "name price")
            .populate('size_id', "name")
            .populate('color_id', "name")
        sortUpPrice.sort((a, b) => b.product_id.price - a.product_id.price);
        sortUpPrice.forEach((product) => {
            return product.product_id.price
        });
        const listCategory = await categoriModel.categoryModel.find();
        const listproduct = await productModel.productModel.find()
        res.render('product_size_color/product_size_color', {
            title: title,
            heading: heading,
            title: 'Product warehouse',
            listproduct: listproduct,
            productListSizeColor: sortUpPrice,
            countProducts: 1,
            countPages: 1,
            page: 1,
            startCount: 1,
            listCategory: listCategory,
            selectedroductName: 'all',
            message: 'Filter products successfully',

        })
    } catch (error) {
        console.log(error);
    }
}
const sortDown = async (req, res) => {
    try {
        const sortDownPrice = await model_product_size_color.product_size_color_Model.find({})
            .populate('product_id', "name price as product_price")
            .populate('size_id', "name")
            .populate('color_id', "name")
        sortDownPrice.sort((a, b) => b.product_id.price - a.product_id.price);
        sortDownPrice.forEach((product) => {
            return product.product_id.price
        });

        // console.log(sortDownPrice.sort());
        const listCategory = await categoriModel.categoryModel.find();
        const listproduct = await productModel.productModel.find()

        res.render('product_size_color/product_size_color', {
            heading: heading,
            title: title,
            title: 'Product warehouse',
            listproduct: listproduct,
            productListSizeColor: sortDownPrice,
            countProducts: 1,
            countPages: 1,
            page: 1,
            startCount: 1,
            listCategory: listCategory,
            selectedroductName: 'all',
            message: 'Filter products successfully'
        })
    } catch (error) {
        console.log(error)
    }

}
const update_product_size_color = async (req, res) => {
    let message = '';
    const id_product_color_size = req.params.id_product_color_size

    const size = await sizeModel.sizeModel.find();
    const color = await colorModel.colorModel.find();
    let product_size_color = await model_product_size_color.product_size_color_Model
        .findById(id_product_color_size)
        .populate('product_id', "name price")
        .populate('size_id', "name")
        .populate('color_id', "name");

    let productupdate = await productModel.productModel.findById(product_size_color.product_id)

    if (req.method == 'POST') {
        const { name, categories, size, color, quantity, price } = req.body;
        console.log(size, color, quantity);
        const existingProduct = await model_product_size_color.product_size_color_Model.findOne({
            product_id: productupdate._id,
            size_id: size,
            color_id: color,
            quantity: quantity
        });
        if (existingProduct) {
            existingProduct.quantity += parseInt(quantity);
            await existingProduct.save();
            message = 'Product already exists. Quantity updated successfully.';
        } else {
            product_size_color.size_id = size;
            product_size_color.color_id = color;
            product_size_color.quantity = quantity;
            await product_size_color.save();
            message = 'Updated successfully'
        }
    }
    res.render('product_size_color/update_product_size_color', {
        title: title,
        heading: heading,
        message: message,
        size: size,
        color: color,
        product_size_color: product_size_color
    })

}
const filterNameProduct = async (req, res) => {
    let message = ''
    const id_product = req.query.productName
    console.log(id_product);
    // 
    const filterProductName = await model_product_size_color.product_size_color_Model.find({ 'product_id': id_product })
        .populate('product_id', "name price")
        .populate('size_id', "name")
        .populate('color_id', "name").sort({ createdAt: -1 });

    const listCategory = await categoriModel.categoryModel.find();
    const listproduct = await productModel.productModel.find()
    if (filterProductName.length === 0) {
        message = 'Product not found'

    } else {
        message = 'Filter products successfully'
    }
    res.render('product_size_color/product_size_color', {
        title: title,
        heading: heading,
        listproduct: listproduct,
        productListSizeColor: filterProductName,
        countProducts: 1,
        countPages: 1,
        page: 1,
        startCount: 1,
        listCategory: listCategory,
        selectedroductName: id_product,
        message: message
    });

}

const search = async (req, res) => {
    try {
        let message = ''
        const searchQuery = req.query.search.toLowerCase();
        console.log(searchQuery);

        const productListSizeColor = await model_product_size_color.product_size_color_Model
            .find()
            .populate('product_id', 'name price')
            .populate('size_id', 'name')
            .populate('color_id', 'name')
            .sort({ createdAt: -1 });

        const filteredList = productListSizeColor.filter((item) => {
            return item.product_id.name.toLowerCase().includes(searchQuery);
        });
        if (filteredList.length > 0) {
            message = 'Search for success'
        } else {
            message = 'Product does not exist'
            // res.redirect('/product_size_color/getListAll/1');

        }
        const listCate = await categoriModel.categoryModel.find()
        const listProduct = await productModel.productModel.find()
        res.render('product_size_color/product_size_color', {
            listproduct: listProduct,
            productListSizeColor: filteredList,
            countProducts: 1,
            countPages: 1,
            page: 1,
            startCount: 1,
            listCategory: listCate,
            selectedroductName: 'all',
            message: message,
            title: title,
            heading: heading
        });
    } catch (error) {
        console.error(error);
        // Xử lý lỗi nếu có
        res.status(500).send('Internal Server Error');
    }
};




module.exports = { search, getListAll, delete_product_color_size, sortUp, sortDown, add_product_size_color, update_product_size_color, filterNameProduct }