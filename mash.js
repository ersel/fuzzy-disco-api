const fs = require('fs');
const path = require('path');
const stations = require('./src/stations');
const locations = require('./locations.json');

const ourLocations = locations.filter(location => (
  stations.some(station => station.code === location.crs)
));

const finalStations = stations.map((station) => {
  const location = ourLocations.find(l => station.code === l.crs);
  if (location) {
    return { ...station, lat: location.lat, lon: location.lon };
  }
  return null;
}).filter(d => d !== null);

const final = path.join(__dirname, 'final.json');

fs.writeFile(final, JSON.stringify(finalStations), () => {
  console.log('done');
});
