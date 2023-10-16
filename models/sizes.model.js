var db = require('./db');

const SizeSChema = new db.mongoose.Schema(
    {    
        name:{type:String,require:true},
    },
    {
        // dinh nghia ten bang du lieu 
        collection:'Sizes'
    }
)
let sizesModel = db.mongoose.model('sizesmMdel',SizeSChema);

module.exports={sizesModel}