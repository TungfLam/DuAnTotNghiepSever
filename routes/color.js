var express = require('express');
var router = express.Router();
var colorCTL = require('../controllers/color.controller')




router.get('/',colorCTL.getAll)



module.exports = router;