var express = require('express');
var router = express.Router();
var colorCTL = require('../controllers/color.controller')

router.get('/',colorCTL.getAll)
router.post('/add',colorCTL.addColor)
router.get('/delete/:idColor',colorCTL.deleteColor)
router.post('/update/:idColor', colorCTL.updateColor);


module.exports = router;