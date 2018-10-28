const Journey = require('../models/journey');
const axios = require('axios');

axios.defaults.baseURL = 'http://transportapi.com/v3/uk';

const generateRequestURI = ({ start, end, operator }) => (
  `/train/station/${start}/live.json?calling_at=${end}&operator=${operator}&type=departure&app_id=${process.env.TRANSPORT_API_APP_ID}&app_key=${process.env.TRANSPORT_API_KEY}`
);

const isLate = time => departure => departure.aimed_departure_time === time && departure.status === 'LATE';
const filterNulls = d => d.filter(x => x !== null)

const index = (req, res) => {
  return Journey.find({ userId: req.authorizer.id })
    .then((journeys) => {
      return Promise.all(journeys.map(generateRequestURI)).then(URIs => 
        Promise.all(URIs.map(axios.get))
      ).then(responses => {
        const results = responses.map((response, idx) => ({
          ...response.data,
          ...journeys[idx].toObject()
        }))
        res.status(200).json(results)
      }).catch(e => console.log(e))
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
};

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
  create,
};
