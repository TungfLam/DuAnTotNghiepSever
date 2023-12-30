var db = require('./db');

var ConversationSchema = new db.mongoose.Schema(
    {
        members: [{
            type: db.mongoose.Schema.Types.ObjectId, ref: 'userModel',
        }]
    },
    { collection: 'conversation' }
);

let ConversationModel = db.mongoose.model('ConversationModel', ConversationSchema);

module.exports = { ConversationModel };

