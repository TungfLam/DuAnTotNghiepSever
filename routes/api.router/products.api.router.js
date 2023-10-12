var express = require('express');
var router = express.Router();
var product_api_CTL = require('../../controllers/api.controller/products.api.controller');

router.get("/" , product_api_CTL.listProducts);

module.exports = router;
