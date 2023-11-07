var express = require('express');
var router = express.Router();
const multer = require('multer');
const upload = multer();

var api_users = require('../controllers/api/api-users')

var api_color = require('../controllers/api/api_color')
var api_size = require('../controllers/api/api_size')
var api_category = require('../controllers/api/api_category')
var api_product_size_color = require('../controllers/api/api_product_size_color')


var api_product = require('../controllers/api/api-product')
var api_bill = require('../controllers/api/api-bill')
// api user



router.get('/users', api_users.listUser);
router.get('/users/pagination', api_users.pagination);
router.post('/userslogin', api_users.userLogin);

router.post('/users', api_users.addUser);
router.put('/users/:idu', api_users.updateUser);
router.delete('/users/:idu', api_users.deleteUser);
//===
// api product

router.get('/products/:skip/:limit', api_product.getProducts);

router.post('/products', upload.array('image'), api_product.createProduct);

router.put('/products/:id', upload.array('image'), api_product.updateProduct);

router.delete('/products/:id', api_product.deleteProduct);
router.get('/products/sortUp', api_product.sortUp);
router.get('/products/sortDown', api_product.sortDown);



//===



// color
router.get('/colors', api_color.listColors);
router.post('/addcolor', api_color.addColor);

// size
router.get('/sizes', api_size.listSizes);
router.post('/addsize', api_size.addSize);

// // category
router.get('/categorys', api_category.listCategorys);
router.post('/addcategory', api_category.addCategory);


// product-size-color
router.get('/getListAll_deltail/:id_product', api_product_size_color.getListAll_deltail);
router.post('/add_product_size_color', api_product_size_color.add_product_size_color);


// api bill

router.get('/bill', api_bill.listBill);
router.get('/bill/pagination', api_bill.pagination);

router.post('/bill', api_bill.addBill);
router.put('/bill/:id', api_bill.updateBill);

router.delete('/bill/:id', api_bill.deleteBill);

//====

module.exports = router;
