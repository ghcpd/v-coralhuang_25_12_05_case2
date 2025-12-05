const express = require('express');
const router = express.Router();

const express = require('express');
const router = express.Router();
const flights = require('../adapters/amadeus');
const hotels = require('../adapters/hotels');

router.get('/', async (req, res) => {
  const q = req.query.q || '';
  // For prototype, return stubbed third-party results
  const flightResults = await flights.searchFlights({q});
  const hotelResults = await hotels.searchHotels({q});
  res.json({results: {flights: flightResults, hotels: hotelResults}, meta: {q}});
});

module.exports = router;
