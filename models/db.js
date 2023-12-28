const mongoose = require('mongoose');

const mongoURL = process.env.MONGO_URL;

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("CONNECT MONGODB ONLINE SUCCESSFULLY");
    })
    .catch((err) => {
        console.log("error connecting to server");
        console.log(err);
    });

module.exports = { mongoose };
