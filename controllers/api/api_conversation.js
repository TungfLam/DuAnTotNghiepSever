var ConversationModel = require('../../models/conversation.model');
var socketIo = require('socket.io');
var http = require('http');

var app = require('express')();
var server = http.createServer(app);
var io = socketIo(server);

var objReturn = {
    status: 1,
    msg: 'OK'
}

// io.on('connection', (socket) => {
//     console.log('Một người dùng đã kết nối');

//     socket.on('disconnect', () => {
//         console.log('Người dùng đã ngắt kết nối');
//     });

//     socket.on('create_conversation', async (conversationData) => {
//         try {
//             const conversation = new ConversationModel.ConversationModel(conversationData);
//             await conversation.save();

//             // Phát thông tin cuộc trò chuyện đến tất cả người dùng khác trong cuộc trò chuyện
//             io.to(conversationData.members).emit('new_conversation', conversation);
//         } catch (error) {
//             console.error(error);
//         }
//     });
// });

exports.createConversation = async (req, res) => {
    const { members } = req.body;

    try {
        const conversation = new ConversationModel.ConversationModel({ members });

        await conversation.save();

        objReturn.data = conversation;
    } catch (error) {
        objReturn.status = 0;
        objReturn.msg = error.message;
    }

    res.json(objReturn);
};

exports.getConversationsByUser = async (req, res) => {
    const { userId } = req.params;
    let list = [];
    try {
        list = await ConversationModel.ConversationModel.find({
            members: { $in: [userId] }
        });

        if (list.length > 0) {
            objReturn.msg = 'có dữ liệu phù hợp';
            objReturn.data = list;
            objReturn.status = 1;
        } else {
            objReturn.status = 0;
            objReturn.msg = 'Không có dữ liệu phù hợp';
            objReturn.data = list;
        }
    } catch (error) {
        objReturn.status = 0;
        objReturn.msg = error.message;
    }

    res.json(objReturn);
};
