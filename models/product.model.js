var db = require('./db');
const productSchema = new db.mongoose.Schema(
    {

        name: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: [String], required: false },
        category_id: { type: db.mongoose.Schema.Types.ObjectId, ref: 'categoryModel' },
        createdAt: { type: String, required: false },
        updatedAt: { type: String, required: false },
        price: { type: Number, required: true },
        rating: { type: Number, require: false }
    },
    { collection: 'product' }
);
let productModel = db.mongoose.model('productModel', productSchema);

const commentSchema = new db.mongoose.Schema(
    {
        product_id: { type: db.mongoose.Schema.Types.ObjectId, ref: 'productModel' },
        user_id: { type: db.mongoose.Schema.Types.ObjectId, ref: 'userModel' },
        comment: { type: String, require: true },
        rating: { type: Number, require: true },
        date: { type: String, require: true }
    },
    {
        collection: 'Comment'
    }
);
let commentModel = db.mongoose.model('commentModel', commentSchema);


module.exports = { productModel, commentModel };