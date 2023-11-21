var db = require('./db');
var productSchema = new db.mongoose.Schema(
    {

        name: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: [String], required: true },
        category_id:{type:db.mongoose.Schema.Types.ObjectId,ref:'categoryModel'},
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        price: { type: Number, required: true }
    },
    { collection: 'product' }
);


let productModel = db.mongoose.model('productModel', productSchema);

module.exports = { productModel };