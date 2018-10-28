const express = require('express');
const JourneysController = require('../controllers/journeys');

const router = express.Router();

router.route('/')
  .get(JourneysController.index)
  .post(JourneysController.create);

module.exports = router;
