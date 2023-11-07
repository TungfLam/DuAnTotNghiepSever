var db = require('./db');

const favorite_SChema = new db.mongoose.Schema(
    {    
        user_id:{type:db.mongoose.Schema.Types.ObjectId,ref:'userModel'},
        product_id:{type:db.mongoose.Schema.Types.ObjectId,ref:'productModel'},
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    {

        collection:'favorite'
    }
)
let favorite_Model = db.mongoose.model('favorite_Model',favorite_SChema);

module.exports={favorite_Model}