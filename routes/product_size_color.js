var express = require('express');
var router = express.Router();
var product_size_color_CTL = require('../controllers/product_size_color.controller')


router.get('/getListAll',product_size_color_CTL.getListAll)
router.get('/add_product_size_color',product_size_color_CTL.add_product_size_color)
router.post('/add_product_size_color',product_size_color_CTL.add_product_size_color)
router.get('/update_product_size_color/:id_product_color_size',product_size_color_CTL.update_product_size_color)
router.post('/update_product_size_color/:id_product_color_size',product_size_color_CTL.update_product_size_color)

router.get('/sortUp',product_size_color_CTL.sortUp)
router.get('/sortDown',product_size_color_CTL.sortDown)
router.get('/delete_product_color_size/:id_product_color_size',product_size_color_CTL.delete_product_color_size)
router.get('/delete_product_color_size/:id_product_color_size',product_size_color_CTL.delete_product_color_size)


module.exports = router;