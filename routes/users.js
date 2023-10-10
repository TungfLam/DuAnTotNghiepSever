var express = require('express');
var router = express.Router();
var userCtrl = require('.././/controllers/user.controller');

router.get("/" , userCtrl.list);
router.get("/add" , userCtrl.add);
router.post("/add" , userCtrl.add);
router.get("/:id" , userCtrl.details);

module.exports = router;
