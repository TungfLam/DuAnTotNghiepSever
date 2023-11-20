const io = require('socket.io')();

io.on('connection' , socket => {
    console.log("a user connected : " + socket.id);

    socket.on('register-device', (deviceId) => {
        console.log("a user join with deviceId : " + deviceId);
        socket.join(deviceId);
        socket.deviceId = deviceId;
    });

    socket.on('push-notification' , (data) => {
        io.emit('push-notification' , data);
    });

    socket.on('push-notification-single' , (data) => {
        io.to(data.deviceId).emit('push-notification-single' , data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected with deviceId: ' + socket.deviceId);
    });
    
    socket.on('connect', () => {
        console.log('User reconnected with deviceId: ' + socket.deviceId);
    });
})

module.exports = io;