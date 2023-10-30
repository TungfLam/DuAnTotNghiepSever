var express = require('express');
var router = express.Router();

var api_users = require('../controllers/api/api-users')
var api_color = require('../controllers/api/api_color')
var api_size = require('../controllers/api/api_size')
var api_category = require('../controllers/api/api_category')
var api_product_size_color = require('../controllers/api/api_product_size_color')



router.get('/users', api_users.listUser);
router.get('/users/pagination', api_users.pagination);
router.post('/userslogin', api_users.userLogin);

router.post('/users', api_users.addUser);
router.put('/users/:idu', api_users.updateUser);
router.delete('/users/:idu', api_users.deleteUser);



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


module.exports = router;
