var db = require('./db');

const bill_SChema = new db.mongoose.Schema(
    {
        user_id: { type: db.mongoose.Schema.Types.ObjectId, ref: 'userModel' },
        cart_id: { type: db.mongoose.Schema.Types.ObjectId, ref: 'cartModel' },
        payments: { type: Number, require: true },
        total_amount: { type: Number, require: true },
        status: { type: String, required: true },
        date: { type: String, required: false }
    },
    {
        collection: 'bill'
    }
)
let billModel = db.mongoose.model('billModel', bill_SChema);

module.exports = { billModel }