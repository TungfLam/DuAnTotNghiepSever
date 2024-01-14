const express = require('express');
const router = express.Router();
const notificationCtrl = require('../controllers/notification.controller');

const multer = require('multer');
const upLoader = multer({ dest: './tmp' });

router.get('/', notificationCtrl.notification);

router.post('/' ,upLoader.single("inputImage"), notificationCtrl.pustNotification);

module.exports = router;