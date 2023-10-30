var db = require('./db');

const ColorSChema = new db.mongoose.Schema(
    {    
        name:{type:String,require:true},
    },
    {
        // dinh nghia ten bang du lieu 
        collection:'color'
    }
)
let colorModel = db.mongoose.model('colorModel',ColorSChema);

module.exports={colorModel}