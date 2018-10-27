const express = require('express');
const pushToken = require('../controllers/pushToken');

const router = express.Router();

router.route('/push-token')
  .put(pushToken.savePushToken);

module.exports = router;
