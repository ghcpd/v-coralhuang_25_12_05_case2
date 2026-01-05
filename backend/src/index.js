require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

app.get('/health', (req, res) => res.json({status: 'ok'}));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Backend listening on ${port}`));
