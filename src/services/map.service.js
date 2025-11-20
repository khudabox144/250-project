// services/map.service.js
const axios = require("axios");

const OSRM_URL = process.env.OSRM_SERVER_URL || "http://router.project-osrm.org";

const getRoute = async (startLat, startLng, destLat, destLng) => {
  const url = `${OSRM_URL}/route/v1/driving/${startLng},${startLat};${destLng},${destLat}?overview=full&geometries=geojson`;

  try {
    const response = await axios.get(url);
    const route = response.data.routes[0];

    return {
      distance: route.distance, // meters
      duration: route.duration, // seconds
      polyline: route.geometry, // geojson object
    };
  } catch (err) {
    console.error("OSRM Route Error:", err);
    return null;
  }
};

module.exports = { getRoute };
