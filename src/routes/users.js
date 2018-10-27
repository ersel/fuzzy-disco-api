const express = require('express');
const UsersController = require('../controllers/users');

const router = express.Router();

router.route('/')
  .get(UsersController.index)
  .post(UsersController.create);

router.route('/push-token').put(UsersController.savePushToken)

module.exports = router;
