var db = require('./db');

var notificationSchema = new db.mongoose.Schema(
    {
        id_user : {type : String , require : false},
        id_product : {type : String , require : false},
        id_bill : {type : String , require : false},
        title : {type : String , require : true},
        content : {type : String , require : true},
        date : {type : String , require : false}
    },
    { collection: 'notification' }
);

let notificationModel = db.mongoose.model('notificationModel', notificationSchema);

module.exports = { notificationModel };