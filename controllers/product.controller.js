var model = require('../models/product.model');
var modelCategories = require('../models/category.model')
var modelColor = require('../models/color.model')
var modelSize = require('../models/sizes.model')


var model_product_size_color = require('../models/product_size_color.model')
var base64 = require('base-64')
var fs = require('fs');
var path = require('path');
const { DateTime } = require('luxon');


const getlistproduct = async (req, res) => {

    const title = 'List Products';
    const itemsPerPage = 5;
    const page = parseInt(req.params.page) || 1;
    const startCount = (page - 1) * itemsPerPage + 1;
    const skip = (page - 1) * itemsPerPage;
    const limit = itemsPerPage;
    const listProducts = await model.productModel.find().skip(skip).limit(limit).sort({ createdAt: -1 })
        .populate('category_id', "name");
    const listCategory = await modelCategories.categoryModel.find()
    const countProducts = await model.productModel.count(); // Tính tổng số sản phẩm
    const countPages = Math.ceil(countProducts / itemsPerPage); // Tính tổng số trang
    res.render('product/listproduct', {
        title: title,
        listProducts: listProducts,
        countProducts: countProducts,
        countPages: countPages,
        page: page,
        startCount: startCount,
        listCategory: listCategory,
        selectedCategoryId: 'all'
    });
};

const detailProduct = async (req, res) => {
    try {
        const title = 'title';
        const idProduct = req.params.idProduct;

        const ListProduct = await model.productModel.findById(idProduct)
        const ListColor = await modelColor.colorModel.find();
        const ListSize = await modelSize.sizeModel.find();
        // console.log(ListCate);
        const details = await model_product_size_color.product_size_color_Model.find({ product_id: idProduct })
            .populate('product_id')
            .populate('size_id', 'name')
            .populate('color_id', 'name');

        res.render('product/detail', {
            title: title,
            productListSizeColor: details,
            ListProduct: ListProduct,
            ListColor: ListColor,
            ListSize: ListSize
        });
    } catch (error) {
        // Xử lý lỗi và trả về một trang lỗi hoặc thông báo lỗi cho người dùng
        res.status(500).json({ error: error });
    }
}
const addDetail = async (req, res) => {
    const { price, size, color, nameProduct,trinhh } = req.body;
    console.log(' req.body', req.body)

    console.log('háhdhasdahsd');
    if (req.method === 'POST') {
        console.log('Trình')

    }


}

const addproduct = async (req, res) => {
    let message = ''
    const { name, description, price, category } = req.body;
    const image = [];
    // Xử lý tất cả các tệp hình ảnh đã tải lên
    for (const file of req.files) {
        const imageBuffer = fs.readFileSync(file.path);
        // mã hóa base64
        const base64Image = imageBuffer.toString('base64');
        image.push(base64Image);
    }
    if (req.method === 'POST') {
        let objProduct = new model.productModel({
            name: name,
            description: description,
            category_id: category,
            image: image,
            price: price,
        });
        try {

            await objProduct.save();
            res.redirect(`/product/listproduct/1}`)
        } catch (error) {
            res.status(500).json({ message: 'Lỗi ghi CSDL: ' + error.message });
        }
    }
}

const deleteproduct = async (req, res) => {
    try {
        let countPages = parseInt(req.query.countPages);
        let countProducts = parseInt(req.query.countProducts)
        if (countProducts % 2 !== 0) {
            countPages -= 1
        }
        let id = req.params.id;
        await model.productModel.findByIdAndDelete(id);
        await model_product_size_color.product_size_color_Model.deleteMany({ product_id: id });
        res.redirect(`/product/listproduct/${countPages}`)
    } catch (error) {
        msg = 'Lỗi Ghi CSDL: ' + error.message;
        console.log(error);

    }
}
const updateproduct = async (req, res) => {
    let id = req.params.id;
    let title = 'Update Product'
    let itemedit = await model.productModel.findById(id);
    const { name, description, price } = req.body;

    const image = [];
    // Xử lý tất cả các tệp hình ảnh đã tải lên
    // for (const file of req.files) {
    //     //đọc file từ thư mục
    //     const imageBuffer = fs.readFileSync(file.path);
    //     // mã hóa base64
    //     const base64Image = imageBuffer.toString('base64');
    //     image.push(base64Image);
    // }

    const nowInVietnam = DateTime.now().setZone('Asia/Ho_Chi_Minh');
    if (req.method === 'POST') {
        let objProduct = new model.productModel({
            id: id,
            name: name,
            description: description,
            // image: image,
            price: price,
            createdAt: nowInVietnam,
            updatedAt: nowInVietnam
        });
        try {
            await model.productModel.findByIdAndUpdate(id, objProduct);
            res.redirect('/product/listproduct/1');
        } catch (error) {
            res.status(500).json({ message: 'Lỗi ghi CSDL: ' + error.message });
        }
    }

    res.render('product/updateproduct', { title: title, itemedit: itemedit })
}

const searchProduct = async (req, res) => {
    const searchQuery = req.query.search.toLowerCase();
    const title = 'List Products';
    const countPages = 1;
    const countProducts = 1;
    const startCount = 1;
    const page = 1;

    const listProducts = await model.productModel.find({
        name: { $regex: new RegExp(searchQuery, 'i') },
    });
    console.log(listProducts);
    const listCategory = await modelCategories.categoryModel.find()
    res.render('product/listproduct', {
        title: title,
        listProducts: listProducts,
        countPages: countPages,
        countProducts: countProducts,
        page: page,
        startCount: startCount,
        listCategory: listCategory,
        selectedCategoryId: 'all',
        message: 'ákdasdkasdk'
    });
}
const sortUp = async (req, res) => {
    const itemsPerPage = 10; // Số sản phẩm trên mỗi trang
    const page = parseInt(req.params.page) || 1; // Mặc định là trang 1
    const startCount = (page - 1) * itemsPerPage + 1;
    const skip = (page - 1) * itemsPerPage;
    const limit = itemsPerPage;
    const listProducts = await model.productModel.find().skip(skip).limit(limit).sort({ createdAt: -1 })
        .populate('category_id', "name");
    const countProducts = await model.productModel.count(); // Tính tổng số sản phẩm
    const countPages = Math.ceil(countProducts / itemsPerPage); // Tính tổng số trang
    const listCategories = await modelCategories.categoryModel.find()
    try {
        const title = 'Product'
        const sortUpPrice = await model.productModel.find({}).sort({ price: 1 }).populate('category_id', "name");
        res.render('product/listproduct', {
            title: title,
            title: title,
            listProducts: sortUpPrice,
            countProducts: countProducts,
            countPages: countPages,
            page: page,
            startCount: startCount,
            listCategory: listCategories,
            selectedCategoryId: 'all'
        })

    } catch (error) {
        console.log(error);
    }
}
const sortDown = async (req, res) => {
    try {

        const itemsPerPage = 10; // Số sản phẩm trên mỗi trang
        const page = parseInt(req.params.page) || 1; // Mặc định là trang 1
        const startCount = (page - 1) * itemsPerPage + 1;
        const skip = (page - 1) * itemsPerPage;
        const limit = itemsPerPage;
        const listProducts = await model.productModel.find().skip(skip).limit(limit).sort({ createdAt: -1 })
            .populate('category_id', "name");
        const countProducts = await model.productModel.count(); // Tính tổng số sản phẩm
        const countPages = Math.ceil(countProducts / itemsPerPage); // Tính tổng số trang
        const listCategories = await modelCategories.categoryModel.find()

        const title = 'Product'
        const sortDownPrice = await model.productModel.find({}).sort({ price: -1 }).populate('category_id', "name");


        res.render('product/listproduct', {
            title: title,
            title: title,
            listProducts: sortDownPrice,
            countProducts: countProducts,
            countPages: countPages,
            page: page,
            startCount: startCount,
            listCategory: listCategories,
            selectedCategoryId: 'all'
        })
    } catch (error) {
        console.log(error);
    }
}
const filterCategory = async (req, res) => {
    let message = ''
    const id_cate = req.query.category
    const filterCategory = await model.productModel.find({ 'category_id': id_cate }).populate('category_id');
    const listCategory = await modelCategories.categoryModel.find();

    res.render('product/listproduct', {
        title: 'List Products',
        message: '123123123',
        listProducts: filterCategory,
        countProducts: 1,
        countPages: 1,
        page: 1,
        startCount: 1,
        listCategory: listCategory,
        selectedCategoryId: id_cate,
        message: 'tìm kiếm thành công'
    });
}

const statistical = (req, res) => {
    res.render('product/statistical', {
        title: 'title',
    });
}

module.exports = { addDetail, getlistproduct, addproduct, deleteproduct, updateproduct, searchProduct, sortUp, sortDown, filterCategory, statistical, detailProduct }