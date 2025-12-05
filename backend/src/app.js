const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const searchRoutes = require('./routes/search');
const bookingsRoutes = require('./routes/bookings');
const paymentsRoutes = require('./routes/payments');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/payments', paymentsRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

module.exports = app;
