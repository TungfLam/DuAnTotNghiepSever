var express = require('express');
var router = express.Router();
var product_size_color_CTL = require('../controllers/product_size_color.controller')


router.get('/getListAll/:page',product_size_color_CTL.getListAll)
router.get('/add_product_size_color',product_size_color_CTL.add_product_size_color)
router.post('/add_product_size_color',product_size_color_CTL.add_product_size_color)
router.get('/update_product_size_color/:id_product_color_size',product_size_color_CTL.update_product_size_color)
router.post('/update_product_size_color/:id_product_color_size',product_size_color_CTL.update_product_size_color)

router.get('/sortUp',product_size_color_CTL.sortUp)
router.get('/sortDown',product_size_color_CTL.sortDown)
router.get('/delete_product_color_size/:id_product_color_size',product_size_color_CTL.delete_product_color_size)
router.post('/updateQuantity',product_size_color_CTL.updateQuantity)

router.get('/filterNameProduct',product_size_color_CTL.filterNameProduct)
router.get('/search',product_size_color_CTL.search)
router.get('/export',product_size_color_CTL.exportExcel)





module.exports = router;