var express = require('express');
var router = express.Router();
var userCtrl = require('..//controllers/user.controller');
var checkLogin = require('../meddlewares/check_login');

const multer = require('multer');
var upLoader = multer({dest : './tmp'});

router.get("/" ,checkLogin.checkLogin ,userCtrl.list);
router.get("/add" , userCtrl.add);
router.post("/add" ,upLoader.single("img-avata"), userCtrl.add);
router.get("/:id" , userCtrl.details);

router.get("/lock/:idUser" , userCtrl.lock);
router.get("/un-lock/:idUser" , userCtrl.unLock);

module.exports = router;
