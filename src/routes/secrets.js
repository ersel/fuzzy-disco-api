const express = require('express');
const SecretsController = require('../controllers/secrets');

const router = express.Router();

router.route('/')
  .get(SecretsController.index)
  .post(SecretsController.create);

module.exports = router;
