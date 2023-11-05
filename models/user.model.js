var db = require('./db');
var userSchema = new db.mongoose.Schema(
    {
        address_id: { type: db.mongoose.Schema.Types.ObjectId, ref: 'address' },

        username: { type: String, required: true },
        password: { type: String, required: true },
        email: { type: String, required: false },
        avata: { type: String, required: false },
        role: { type: String, required: true },
        full_name: { type: String, required: false },
        phone_number: { type: Number, required: false }
    },
    { collection: 'user' }
);
const addressChema = new db.mongoose.Schema(
    {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalcode: { type: String, required: true },
        country: { type: String, required: true }
    },
    { collection: 'address' }
);

let userModel = db.mongoose.model('userModel', userSchema);
let addressModel = db.mongoose.model('addressModel', addressChema);

module.exports = { userModel, addressModel };