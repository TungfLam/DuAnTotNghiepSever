var express = require('express');
var router = express.Router();
var indexContrl = require('../controllers/index.controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', indexContrl.login);
router.post('/login', indexContrl.login);

module.exports = router;
