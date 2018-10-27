const mongoose = require('mongoose');

const secretSchema = new mongoose.Schema({
  message: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Secret =  mongoose.model('Secret', secretSchema);

module.exports = Secret;
