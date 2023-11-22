var express = require('express');
var router = express.Router();
var categoryCTL = require('../controllers/category.controller')


router.get('/',categoryCTL.getAll)
router.get('/delete/:idCate',categoryCTL.deleteCate)
router.post('/add',categoryCTL.addCate)




module.exports = router;