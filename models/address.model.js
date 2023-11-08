var db = require('./db');

const address_SChema = new db.mongoose.Schema(
    {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalcode: { type: String, required: true },
        country: { type: String, required: true }
    },
    {
        collection: 'address'
    }
)
let addressModel = db.mongoose.model('addressModel', address_SChema);

module.exports = { addressModel }