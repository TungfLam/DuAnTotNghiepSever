var express = require('express');
var router = express.Router();
var multer = require('multer');

var uploadCloud = require('../meddlewares/uploader')

var bannerController = require('../controllers/banner.controller')

router.get('/', bannerController.getAllBanner);
router.post('/add', uploadCloud.single('image'), bannerController.addBanner);
router.get('/delete/:id', bannerController.deleteBanner);
router.get('/delete/:id', bannerController.deleteBanner);
router.post('/edit/:id',uploadCloud.single('image'), bannerController.editBanner);


module.exports = router;
