var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer();

var billController = require('../controllers/bill.controller')

router.get('/', billController.loc);
router.post('/', upload.none(), billController.loc);

router.get('/detail/:id', billController.detail);
router.post('/detail/:id', upload.none(), billController.detail);

module.exports = router;
