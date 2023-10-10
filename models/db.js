/// connect monggodb 
const mongoose  = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/ADADAS')
            .catch((err)=>{
                console.log("error connecting to server");
                console.log(err);
            })

            module.exports={mongoose}