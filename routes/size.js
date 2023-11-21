var express = require('express');
var router = express.Router();
var sizeCTL = require('../controllers/size.controller')


router.get('/',sizeCTL.getAll)

module.exports = router;