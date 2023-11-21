var express = require('express');
var router = express.Router();
var categoryCTL = require('../controllers/category.controller')


router.get('/',categoryCTL.getAll)



module.exports = router;