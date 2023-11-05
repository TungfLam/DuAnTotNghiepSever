var db = require('./db');
var productSchema = new db.mongoose.Schema(
    {

        name: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: [String], required: true },
        createdAt: { type: String, required: false },
        updatedAt: { type: String, required: false },

        price: { type: String, required: true }
    },
    { collection: 'product' }
);


let productModel = db.mongoose.model('productModel', productSchema);

module.exports = { productModel };