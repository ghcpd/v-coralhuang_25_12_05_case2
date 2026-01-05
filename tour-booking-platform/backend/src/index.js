const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
app.use(express.json());

app.get('/', (req, res) => {
  res.json({status: 'ok', service: 'tour-booking-backend'});
});

// Basic route placeholders
app.use('/api/auth', require('./routes/auth'));
app.use('/api/search', require('./routes/search'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/payments', require('./routes/payments'));

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`API listening on ${port}`));
}

module.exports = app;
