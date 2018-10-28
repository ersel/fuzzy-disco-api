const User = require('../models/user');

const savePushToken = (req, res) => {
  const userId = req.authorizer.id;
  const expoPushToken = req.body.token;

  User.findOneAndUpdate({ _id: userId }, { $set: { expoPushToken } }, { new: true })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
};

module.exports = {
  savePushToken,
};
