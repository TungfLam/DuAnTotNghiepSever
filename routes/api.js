var express = require('express');
var router = express.Router();

var api_users = require('../controllers/api/api-users')

router.get('/users', api_users.listUser);
router.get('/users/pagination', api_users.pagination);
router.post('/userslogin', api_users.userLogin);

router.post('/users', api_users.addUser);
router.put('/users/:idu', api_users.updateUser);
router.delete('/users/:idu', api_users.deleteUser);



module.exports = router;
