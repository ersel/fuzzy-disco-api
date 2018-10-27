const User = require('../models/user');
const jwt = require('jsonwebtoken');

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
      jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '48h' }, (err, token) => {
        if (err) {
          res.sendStatus(500);
        } else {
          res.status(200).json({ token }); 
        }
      });
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
