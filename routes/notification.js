const express = require('express');
const router = express.Router();
const notificationCtrl = require('../controllers/notification.controller');

router.get('/', notificationCtrl.pustNotification);
// router.post('/' , notificationCtrl.pustNotification);

module.exports = router;