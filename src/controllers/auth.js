const jwt = require('jsonwebtoken');
const User = require('../models/user');

const login = (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        res.status(401).json({
          message: 'User not found with given email address.',
        });
      } else {
        if (user.validatePassword(req.body.password)) {
          const payload = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          };
          
          jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10m' }, (err, token) => {
            if (err) {
              res.sendStatus(500);
            } else {
              res.status(200).json({ token }); 
            }
          });
        } else {
          res.status(401).json({
            message: 'The email/password combination is incorrect.',
          });
        }
      }
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
}

module.exports = {
  login,
};
