const express = require('express');
const router = express.Router();
const controller = require('../controllers/bookings');

router.post('/', controller.createBooking);
router.get('/:id', controller.getBooking);
router.get('/', controller.listBookings);

module.exports = router;
