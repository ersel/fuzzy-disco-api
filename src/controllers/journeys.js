const axios = require('axios');
const moment = require('moment');
const Journey = require('../models/journey');

axios.defaults.baseURL = 'http://transportapi.com/v3/uk';

const generateRequestURI = ({ start, end, operator }) => (
  `/train/station/${start}/live.json?calling_at=${end}&operator=${operator}&type=departure&app_id=${process.env.TRANSPORT_API_APP_ID}&app_key=${process.env.TRANSPORT_API_KEY}`
);

const index = (req, res) => {
  const now = moment().utc();
  return Journey.find({ userId: req.authorizer.id, time: { $gt: now.subtract(3, 'hours').utc().unix() } })
    .then(journeys => Promise.all(journeys.map(generateRequestURI))
      .then(URIs => Promise.all(URIs.map(axios.get)))
      .then((responses) => {
        const results = responses.map((response, idx) => ({
          ...response.data,
          ...journeys[idx].toObject(),
        }));
        res.status(200).json(results);
      }))
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
};

const find = (req, res) => Journey.findOne({ userId: req.authorizer.id, _id: req.params.id })
  .then((journey) => {
    if (journey === null) {
      return res.sendStatus(404);
    }
    return axios.get(generateRequestURI(journey))
      .then((response) => {
        console.log(response.data.departures.all);
        const departure = response.data.departures.all
          .find(d => d.aimed_departure_time === moment.unix(journey.time).format('HH:mm'));

        res.status(200).json({
          ...journey.toObject(),
          ...departure && {
            departure: {
              platform: departure.platform,
              operator: departure.operator_name,
              status: departure.status,
              expectedDeparture: departure.expected_departure_time,
            },
          },
        });
      });
  })
  .catch((error) => {
    console.log(error);
    res.sendStatus(500);
  });

const create = (req, res) => {
  const journey = new Journey({
    userId: req.authorizer.id,
    start: req.body.start,
    end: req.body.end,
    time: req.body.time,
    operator: req.body.operator,
  });

  journey.save()
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
  find,
  create,
};
