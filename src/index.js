const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const { auth, users, secrets } = require('./routes');
const authenticate = require('./middleware/authenticate');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/auth', auth);
app.use('/users', users);
app.use('/secrets', authenticate, secrets)

mongoose.connect(process.env.DATABASE_URL, () => {
  console.log('connected to database');
  app.listen(3000, () => {
    console.log('server listening on http://127.0.0.1:3000');
  });
});
