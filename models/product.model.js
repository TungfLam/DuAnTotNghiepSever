var db = require('./db');
var productSchema = new db.mongoose.Schema(
    {

        name: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: [String], required: true },
        category_id:{type:db.mongoose.Schema.Types.ObjectId,ref:'categoryModel'},
        createdAt: { type: String, required: true },
        updatedAt: { type: String, required: true },
        price: { type: Number, required: true }
    },
    { collection: 'product' }
);


let productModel = db.mongoose.model('productModel', productSchema);

module.exports = { productModel };