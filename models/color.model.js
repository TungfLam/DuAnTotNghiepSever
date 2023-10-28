var db = require('./db');

const colorSChema = new db.mongoose.Schema(
    {    
        name:{type:String,require:true},
    },
    {
        // dinh nghia ten bang du lieu 
        collection:'color'
    }
)
let colorModel = db.mongoose.model('colorModel',colorSChema);

module.exports={colorModel}