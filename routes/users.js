const express = require('express');
const router = express.Router();
const userCtrl = require('..//controllers/user.controller');
const checkLogin = require('../meddlewares/check_login');

const multer = require('multer');
const upLoader = multer({dest : './tmp'});

router.get("/", checkLogin.checkLogin ,userCtrl.list);
router.get("/add", checkLogin.checkLogin , userCtrl.add);
router.post("/add", checkLogin.checkLogin ,upLoader.single("img-avata"), userCtrl.add);
router.get("/:id" , checkLogin.checkLogin, userCtrl.details);
router.post("/:id", checkLogin.checkLogin ,upLoader.single("img-avata"), userCtrl.edit);

router.get("/lock/:idUser", checkLogin.checkLogin , userCtrl.lock);
router.get("/un-lock/:idUser" , checkLogin.checkLogin , userCtrl.unLock);

module.exports = router;
