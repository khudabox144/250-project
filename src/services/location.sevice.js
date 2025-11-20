// services/location.service.js
const axios = require("axios");

const getCoordinatesFromAddress = async (address) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${address}`;

  const res = await axios.get(url);

  if (!res.data.length) return null;

  return {
    lat: parseFloat(res.data[0].lat),
    lng: parseFloat(res.data[0].lon),
  };
};

module.exports = { getCoordinatesFromAddress };
