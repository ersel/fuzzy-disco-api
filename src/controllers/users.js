const User = require('../models/user');

const index = (req, res) => {
  User.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
};

const create = (req, res) => {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  });

  user.save()
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
};

const savePushToken = (req, res) => {
  const userId = req.body.id;
  const expoPushToken = req.body.token;

  User.findOneAndUpdate(userId, { $set: { expoPushToken } }, {new: true}).then((user) => {
    res.status(200).json(user);
  }).catch(err => {
    console.log(err);
    res.sendStatus(500);
  });
}

module.exports = {
  index,
  create,
  savePushToken
};
