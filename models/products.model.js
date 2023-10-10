var db = require('./db');



const ProductSChema = new db.mongoose.Schema(
    {
        name: { type: String, require: true },
        description: { type: String, require: true },
        image: [{ type: String, require: true }],
        price: { type: String, require: true },
        createdAt: { type: String, require: true },
        updatedAt: { type: String, require: true },
    },
    {
        // dinh nghia ten bang du lieu 
        collection: 'Products',

    }
)
// ProductSChema.pre('findOneAndUpdate', function (next) {
//     this.update({}, { $set: { updatedAt: new Date() } });
//     next();
// });

// // Middleware để cập nhật trường createdAt và updatedAt khi tạo mới
// ProductSChema.pre('save', function (next) {
//     const currentDate = new Date();
//     this.updatedAt = currentDate;
//     if (!this.createdAt) {
//         this.createdAt = currentDate;
//     }
//     next();
// });
let ProductModel = db.mongoose.model('ProductModel', ProductSChema);

module.exports = { ProductModel }