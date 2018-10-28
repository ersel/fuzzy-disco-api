const mongoose = require('mongoose');
const moment = require('moment');
const axios = require('axios');
const Journey = require('./src/models/journey');
const User = require('./src/models/user');
const { sendNotifications } = require('./service/PushNotifications');
const stations = require('./src/stations');

axios.defaults.baseURL = 'http://transportapi.com/v3/uk';

const request = ({ start, end, operator }) => (
  `/train/station/${start}/live.json?calling_at=${end}&operator=${operator}&type=departure&app_id=${process.env.TRANSPORT_API_APP_ID}&app_key=${process.env.TRANSPORT_API_KEY}`
);

const isLate = (time, departure) => departure.aimed_departure_time === time && departure.status === 'LATE';
const isBus = departure => departure.status === 'BUS';
const isLateOrBus = time => departure => isLate(time, departure) || isBus(departure);
const filterNulls = d => d.filter(x => x !== null);

module.exports.handler = async () => {
  const now = moment();

  try {
    await mongoose.connect(process.env.DATABASE_URL);
    const journeys = await Journey.aggregate([
      { $match: { time: { $gt: now.utc().unix(), $lte: now.add('60', 'minutes').utc().unix() } } },
    ]);

    await Promise.all(journeys.map(async (journey) => {
      const { data } = await axios.get(request(journey));
      const scheduledDepartureString = moment.unix(journey.time).format('HH:mm');
      const departures = data.departures.all;
      const station = data.station_name;
      if (departures.some(isLateOrBus(scheduledDepartureString))) {
        const departure = departures.find(isLateOrBus(scheduledDepartureString));
        const user = await User.findById(journey.userId);
        if (departure.status === 'LATE') {
          return {
            to: user.expoPushToken,
            title: '⏰ Delayed Journey!',
            body: `Your ${scheduledDepartureString} train from ${station} to ${stations.find(s => s.code === journey.end).name} is delayed. The new departure time is ${departure.expected_departure_time}`,
          };
        }

        return {
          to: user.expoPushToken,
          title: '🚌 Rail Replacement Bus!',
          body: `Your ${scheduledDepartureString} train from ${station} to ${stations.find(s => s.code === journey.end).name} has been replaced with a bus service!`,
        };
      }
      return null;
    }))
      .then(filterNulls)
      .then(sendNotifications);

    return null;
  } catch (error) {
    console.log('ERROR:', JSON.stringify(error));
  }
};
