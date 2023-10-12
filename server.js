const express = require('express');
const app = express();
const port = 6868;
var model = require('./models/products.model');

app.get('/api/data', async (req, res) => {
    let listproducts = await model.ProductModel.find();
    return res.status(200).json({
        massage: 'success',
        listproducts
    });

});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
