var express = require('express');
var router = express.Router();
const discountController = require('../controllers/discount.controller')



router.get('/',discountController.getAllDiscount );
router.post('/add', discountController.addDiscount);
router.get('/delete/:id', discountController.deleteDiscount);
router.post('/edit/:id', discountController.editDiscount);



module.exports = router;
