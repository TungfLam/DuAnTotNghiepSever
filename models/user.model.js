var db = require('./db');
var userSchema = new db.mongoose.Schema(
    {
        avata: { type: String, required: false },
        username: { type: String, required: false },
        password: { type: String, required: true },
        email: { type: String, required: false },
        address : {type : String , require : false},
        role: { type: String, required: true },
        full_name: { type: String, required: false },
        phone_number: { type: String, required: true },
        status : {type : Boolean , require : true},
        token : {type : String , require : false},
        deviceId : {type : String , require : false},
    },
    { collection: 'users' }
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