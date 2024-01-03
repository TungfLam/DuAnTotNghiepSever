var MessageModel = require('../../models/message.model');
var socketIo = require('socket.io');
let { DateTime } = require('luxon');
var http = require('http');
let dateFormat = require('date-format')
let moment = require('moment')
const socketIO = require('socket.io');

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

//     socket.on('send_message', async (message) => {
//         try {
//             const newMessage = new MessageModel.MessageModel(message);
//             await newMessage.save();

//             // Phát tin nhắn đến tất cả người dùng khác trong cuộc trò chuyện
//             io.to(message.conversationId).emit('receive_message', newMessage);
//         } catch (error) {
//             console.error(error);
//         }
//     });
// });

exports.createMessage = async (req, res) => {
    const { conversationId, sender, text } = req.body;
    var date = moment(Date.now()).utc().toDate();


    try {
        const message = new MessageModel.MessageModel({
            conversationId,
            sender,
            text,
            createdAt: date
        });

        await message.save();
        // Phát một sự kiện 'new_message' với tin nhắn mới
        // io.emit('receive_message', message);
        objReturn.data = message;
    } catch (error) {
        objReturn.status = 0;
        objReturn.msg = error.message;
    }

    res.json(objReturn);
};

exports.getMessagesByConversation = async (req, res) => {
    let list = [];

    const { conversationId } = req.params;

    try {
        list = await MessageModel.MessageModel.find({
            conversationId
        });

        if (list.length > 0) {
            objReturn.data = list;
            objReturn.msg = 'có dữ liệu phù hợp';
            objReturn.status = 1;

        } else {
            objReturn.status = 0;
            objReturn.data = list;
            objReturn.msg = 'Không có tin nhắn nào trong cuộc trò chuyện này';
        }
    } catch (error) {
        objReturn.status = 0;
        objReturn.msg = error.message;
    }

    res.json(objReturn);
};
