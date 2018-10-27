const Secret = require('../models/secret');

const index = (req, res) => {
  Secret.find({ userId: req.authorizer.id })
    .then((secrets) => {
      res.status(200).json(secrets);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
};

const create = (req, res) => {
  const secret = new Secret({
    message: req.body.message,
    userId: req.authorizer.id,
  });

  secret.save()
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
