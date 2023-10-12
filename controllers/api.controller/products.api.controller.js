var model = require('../../models/products.model');


const listProducts = async (req,res) => {
    let listproducts = await model.ProductModel.find();
    return res.status(200).json({
        message: 'success',
        listproducts
    });

}


module.exports = { listProducts }
