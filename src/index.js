const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const expressListRoutes   = require('express-list-routes');
const router = express.Router();

const { auth, users, journeys, pushToken } = require('./routes');
const authenticate = require('./middleware/authenticate');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

router.use('/auth', auth);
router.use('/users', users);
router.use('/users', authenticate, pushToken);
router.use('/journeys', authenticate, journeys);
app.use(router);

router.stack.forEach(r => {
  const prefix = r.regexp.toString().replace(/\W/g, '').slice(0, -1)
  expressListRoutes({ prefix: `${prefix}` }, '', r.handle);
})

mongoose.connect(process.env.DATABASE_URL, () => {
  console.log('connected to database');
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log('server listening on http://127.0.0.1:3000');
  });
});
