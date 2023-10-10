var model = require('../models/products.model');
var base64 = require('base-64')
var fs = require('fs');
var path = require('path');
const { DateTime } = require('luxon');

const getlistproduct = async (req, res) => {
    var title = 'List Products'
    let listProducts = await model.ProductModel.find();
    res.render('product/listproduct', { title: title, listProducts: listProducts })
}

const addproduct = async (req, res) => {
    const { name, description, price } = req.body;

    // const image = req.file.filename; 
    const image = [];
    // Xử lý tất cả các tệp hình ảnh đã tải lên
    for (const file of req.files) {
        const imageBuffer = fs.readFileSync(file.path);
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
            res.redirect('/product/listproduct');
        } catch (error) {
            res.status(500).json({ message: 'Lỗi ghi CSDL: ' + error.message });
        }
    }
}

const deleteproduct = async (req, res) => {
    try {
        let id = req.params.id;
        console.log(id);
        await model.ProductModel.findByIdAndDelete(id);
        res.redirect('/product/listproduct')

    } catch (error) {
        msg = 'Lỗi Ghi CSDL: ' + error.message;
        console.log(error);
    }
}




module.exports = { getlistproduct, addproduct, deleteproduct }