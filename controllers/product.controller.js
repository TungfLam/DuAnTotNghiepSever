var model = require('../models/products.model');
var base64 = require('base-64')
var fs = require('fs');
var path = require('path');
const { DateTime } = require('luxon');

const getlistproduct = async (req, res) => {
    const title = 'List Products';
    const itemsPerPage = 10; // Số sản phẩm trên mỗi trang
    const page = parseInt(req.params.page) || 1; // Mặc định là trang 1
    const startCount = (page - 1) * itemsPerPage + 1;
    const skip = (page - 1) * itemsPerPage;
    const limit = itemsPerPage;
    const listProducts = await model.ProductModel.find().skip(skip).limit(limit).sort({ createdAt: -1 });
    const countProducts = await model.ProductModel.count(); // Tính tổng số sản phẩm
    const countPages = Math.ceil(countProducts / itemsPerPage); // Tính tổng số trang
    res.render('product/listproduct', {
        title: title,
        listProducts: listProducts,
        countProducts: countProducts,
        countPages: countPages,
        page: page,
        startCount: startCount
    });
};


const addproduct = async (req, res) => {
    const { name, description, price } = req.body;
    let countPages = parseInt(req.query.countPages);
    let countProducts = parseInt(req.query.countProducts)
    if (countProducts % 10 === 0) {
        countPages += 1
    }
    const image = [];
    // Xử lý tất cả các tệp hình ảnh đã tải lên
    for (const file of req.files) {
        const imageBuffer = fs.readFileSync(file.path);
        // mã hóa base64
        const base64Image = imageBuffer.toString('base64');
        image.push(base64Image);
    }
    const nowInVietnam = DateTime.now().setZone('Asia/Ho_Chi_Minh');
    if (req.method === 'POST') {
        let objProduct = new model.ProductModel({
            name: name,
            description: description,
            image: image,
            price: price,
            createdAt: nowInVietnam,
            updatedAt: nowInVietnam
        });
        try {

            await objProduct.save();
            res.redirect(`/product/listproduct/${countPages}`)
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
        await model.ProductModel.findByIdAndDelete(id);
        res.redirect(`/product/listproduct/${countPages}`)
    } catch (error) {
        msg = 'Lỗi Ghi CSDL: ' + error.message;
        console.log(error);

    }
}
const updateproduct = async (req, res) => {
    let id = req.params.id;
    let title = 'Update Product'
    let itemedit = await model.ProductModel.findById(id);
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
        let objProduct = new model.ProductModel({
            id: id,
            name: name,
            description: description,
            // image: image,
            price: price,
            createdAt: nowInVietnam,
            updatedAt: nowInVietnam
        });
        try {
            await model.ProductModel.findByIdAndUpdate(id, objProduct);
            res.redirect('/product/listproduct/1');
        } catch (error) {
            res.status(500).json({ message: 'Lỗi ghi CSDL: ' + error.message });
        }
    }

    res.render('product/updateproduct', { title: title, itemedit: itemedit })
}

const searchProduct = async (req, res) => {
    const searchQuery = req.query.search; // Lấy giá trị từ trường tìm kiếm
    const title = 'timf kieesm thanh cong';
    const countPages = 1;
    const countProducts = 1;
    const startCount = 1
    const page = 1
    const listProducts = await model.ProductModel.find({ name:searchQuery})

    res.render('product/listproduct', {
        title: title,
        listProducts: listProducts,
        countPages: countPages,
        countProducts: countProducts,
        listProducts: listProducts,
        page: page,
        startCount: startCount
    });
};
module.exports = { getlistproduct, addproduct, deleteproduct, updateproduct, searchProduct }