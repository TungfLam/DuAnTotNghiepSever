var db = require('./db');

const userSchema = new db.mongoose.Schema(
    {
        avatar : {type : String , require : false},
        username : {type : String , require : true},
        password : {type : String , require : true},
        email : {type : String , require : false},
        full_name : {type : String , require : true},
        address_id : {type : db.mongoose.Schema.Types.ObjectId , ref : 'addressModel'},
        phone_number : {type : String , require : false},
    },
    {
        collection : 'user'
    }
)
let userModel = db.mongoose.model('userModel' , userSchema);

const addressSchema = new db.mongoose.Schema(
    {
        address : {type : String , require : true},
        city : {type : String , require : true},
        postalcode : {type : String , require : true},
        country : {type : String , require : true}
    },
    {
        collection : 'address'
    }
)
let addressModel = db.mongoose.model('addressModel' , addressSchema);

module.exports = {userModel , addressModel}