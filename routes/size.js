var express = require('express');
var router = express.Router();
var sizeCTL = require('../controllers/size.controller')


router.get('/',sizeCTL.getAll)
router.post('/add',sizeCTL.addSize)
router.get('/delete/:idSize',sizeCTL.deleteSize)
router.post('/update/:idSize', sizeCTL.updateSize);

module.exports = router;