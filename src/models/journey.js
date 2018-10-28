const mongoose = require('mongoose');

const journey = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  start: String,
  end: String,
  time: Number,
  operator: String,
});

const Journey =  mongoose.model('Journey', journey);

module.exports = Journey;
