var express = require('express');
var router = express.Router();
var multer = require('multer');

var product_controller = require('../controllers/product.controller');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // có file lưu vào up load 
      cb(null, './upload');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '_' + file.originalname);
    },
  });

  const upload = multer({ storage: storage });

router.get('/listproduct', product_controller.getlistproduct);
router.post('/addproduct', upload.array('image',5), product_controller.addproduct);
router.get('/deleteproduct/:id', product_controller.deleteproduct);
router.post('/updateproduct/:id',upload.array('image',5),product_controller.updateproduct);
router.get('/updateproduct/:id',upload.array('image',5),product_controller.updateproduct);

module.exports = router;