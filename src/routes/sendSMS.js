const express = require('express');
const smsController = require('../controllers/sendSMS');

const router = express.Router();

router.route('/send')
  .post(smsController.sendSMS);

module.exports = router;
