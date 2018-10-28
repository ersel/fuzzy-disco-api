const Journey = require('../models/journey');

const index = (req, res) => {
  Journey.find({ userId: req.authorizer.id })
    .then((journeys) => {
      res.status(200).json(journeys);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
};

const create = (req, res) => {
  const journey = new Journey({
    userId: req.authorizer.id,
    start: req.body.start,
    end: req.body.end,
    time: req.body.time,
    operator: req.body.operator,
  });

  journey.save()
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
};

module.exports = {
  index,
  create,
};
