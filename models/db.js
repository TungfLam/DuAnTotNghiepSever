
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://nbduy4606:qRNgLXdNCDBcP2pb@datad.qvsedpp.mongodb.net/du_an_tot_nghiep?retryWrites=true&w=majority')
    .then(() => {
        console.log("CONNECT MONGODB ONLINE SUCCESSFULLY");
    })
    .catch((err) => {
        console.log("error connecting to server");
        console.log(err);
    })

module.exports = { mongoose }
