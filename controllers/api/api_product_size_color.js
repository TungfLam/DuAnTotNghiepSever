const model_product_size_color = require('../../models/product_size_color.model')
const productModel = require('../../models/products.model');
const colorModel = require('../../models/color.model')
const sizeModel = require('../../models/sizes.model')
const categoriModel = require('../../models/category.model')


const getListAll_deltail = async (req, res) => {
    try {
        let id_product = req.params.id_product;
        const productListSize = await model_product_size_color.product_size_color_Model.find({ product_id: id_product }).sort({ createdAt: -1 })
            .populate('product_id', "name price")
            .populate('category_id', "name")
            .populate('size_id', "name")
            .populate('color_id', "name");
            console.log('ádasdasd',productListSize);
        res.status(200).json({ productListSize: productListSize });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi truy vấn CSDL: ' + error.message });

    }
}
const add_product_size_color = async (req, res) => {
    console.log('ádkjaskjfjaksfkj');
    if (req.method === 'POST') {
        try {
            const { name, categories, size, color, quantity } = req.body;

            // Truy vấn các ObjectId tương ứng từ cơ sở dữ liệu
            const checkproduct = await productModel.ProductModel.findOne({ name: name });
            const checkcategories = await categoriModel.categoryModel.findOne({ name: categories });
            const checksizes = await sizeModel.sizeModel.findOne({ name: size });
            const checkcolors = await colorModel.colorModel.findOne({ name: color });
            if (!checkproduct) {
                return res.status(400).json({ message: 'Không tìm thấy sản phẩm tương ứng.' });
            }
            if (!checkcategories) {
                return res.status(400).json({ message: 'Không tìm thấy danh mục tương ứng.' });

            }
            if (!checksizes) {
                return res.status(400).json({ message: 'Không tìm thấy  kích thước  tương ứng.' });

            }
            if (!checkcolors) {
                return res.status(400).json({ message: 'Không tìm thấy  màu sắc tương ứng.' });

            }

            const obj_product_size_color = new model_product_size_color.product_size_color_Model({
                product_id: checkproduct._id,
                category_id: checkcategories._id,
                size_id: checksizes._id,
                color_id: checkcolors._id,
                quantity: quantity,
                
            });

            await obj_product_size_color.save();
            return res.status(200).json({ message: 'Thêm!!!! thành công' });

        } catch (error) {
            res.status(500).json({ message: 'Lỗi ghi CSDL: ' + error.message });
        }
    }
}


module.exports ={getListAll_deltail,add_product_size_color}