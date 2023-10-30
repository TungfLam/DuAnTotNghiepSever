var express = require('express');
var router = express.Router();
var product_size_color_CTL = require('../controllers/product_size_color.controller')


router.get('/getListAll',product_size_color_CTL.getListAll)
router.get('/delete_product_color_size/:id_product_color_size',product_size_color_CTL.delete_product_color_size)


module.exports = router;