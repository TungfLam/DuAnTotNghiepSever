var db = require('./db');

const product_size_color_SChema = new db.mongoose.Schema(
    {    
        product_id:{type:db.mongoose.Schema.Types.ObjectId,ref:'productModel'},
        category_id:{type:db.mongoose.Schema.Types.ObjectId,ref:'categoryModel'},
        size_id:{type:db.mongoose.Schema.Types.ObjectId,ref:'sizeModel'},
        color_id:{type:db.mongoose.Schema.Types.ObjectId,ref:'colorModel'},
        quantity:{type:String,require:true},
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    {
        // dinh nghia ten bang du lieu 
        collection:'product_size_color'
    }
)
let product_size_color_Model = db.mongoose.model('product_size_color_Model',product_size_color_SChema);

module.exports={product_size_color_Model}