var express = require('express');
var router = express.Router();
const multer = require('multer');
const upload = multer();

var api_users = require('../controllers/api/api-users')
var api_product = require('../controllers/api/api-product')
// api user


router.get('/users', api_users.listUser);
router.get('/users/pagination', api_users.pagination);
router.post('/userslogin', api_users.userLogin);

router.post('/users', api_users.addUser);
router.put('/users/:idu', api_users.updateUser);
router.delete('/users/:idu', api_users.deleteUser);
//===
// api product

router.get('/products', api_product.getProducts);

router.post('/products', upload.array('image'), api_product.createProduct);

router.put('/products/:id', upload.array('image'), api_product.updateProduct);

router.delete('/products/:id', api_product.deleteProduct);

//===



module.exports = router;
