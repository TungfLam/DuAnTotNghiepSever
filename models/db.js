const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://nbduy4606:qRNgLXdNCDBcP2pb@datad.qvsedpp.mongodb.net/du_an_tot_nghiep?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("CONNECT MONGODB ONLINE SUCCESSFULLY");
    })
    .catch((err) => {
        console.log('loi ket noi CSDL');
        console.log(err);
    });

module.exports = { mongoose };