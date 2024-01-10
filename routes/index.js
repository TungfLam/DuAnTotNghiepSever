var express = require('express');
var router = express.Router();
var indexContrl = require('../controllers/index.controller');

/* GET home page. */
router.get('/', indexContrl.bashboard);

router.get('/login', indexContrl.login);
router.post('/login', indexContrl.login);

router.get('/logout', indexContrl.logout);
router.post('/logout', indexContrl.logout);

module.exports = router;
