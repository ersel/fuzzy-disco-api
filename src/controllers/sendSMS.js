const myClockwork = require('clockwork');
const User = require('../models/user');

const sendMessage = (number, message, user, res) => {
  const clockwork = myClockwork({ key: process.env.CLOCKWORK_SMS });
  clockwork.sendSms({ To: number, Content: `${message} - sent by ${user.firstName} ${user.lastName}` },
    (error) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });
};

const sendSMS = (req, res) => {
  const userId = req.authorizer.id;
  const { number, message } = req.body;

  User.findOne({ _id: userId })
    .then(user => sendMessage(number, message, user, res))
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
};

module.exports = {
  sendSMS,
};
