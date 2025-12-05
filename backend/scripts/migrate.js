const fs = require('fs');
const path = require('path');
require('dotenv').config();
const db = require('../src/db');

async function run() {
  const sql = fs.readFileSync(path.join(__dirname, '..', 'schema.sql'), 'utf8');
  // split into statements and run
  const statements = sql.split(/;\s*\n/).map(s => s.trim()).filter(Boolean);
  for (const stmt of statements) {
    await db.raw(stmt);
  }

  // seed sample data if empty
  const tours = await db('tours').select('id').limit(1);
  if (tours.length === 0) {
    await db('tours').insert([
      { title: 'Grand Canyon Day Trip', description: 'Explore the canyon with an expert guide', location: 'Grand Canyon, AZ', price_cents: 12900, available_from: '2026-01-01', available_to: '2028-12-31' },
      { title: 'Paris City Highlights', description: '3-day guided city tour in Paris', location: 'Paris, France', price_cents: 59900, available_from: '2026-01-01', available_to: '2028-12-31' }
    ]);
  }

  const flights = await db('flights').select('id').limit(1);
  if (flights.length === 0) {
    await db('flights').insert([
      { origin: 'NYC', destination: 'LON', depart_date: '2026-09-01', return_date: '2026-09-10', price_cents: 45000, airline: 'SampleAir' },
      { origin: 'LAX', destination: 'NRT', depart_date: '2026-10-05', return_date: '2026-10-20', price_cents: 80000, airline: 'SkyFly' }
    ]);
  }

  const hotels = await db('hotels').select('id').limit(1);
  if (hotels.length === 0) {
    await db('hotels').insert([
      { name: 'Bayfront Inn', location: 'San Diego, CA', price_cents: 14900, rooms: 10 },
      { name: 'Eiffel Residence', location: 'Paris, France', price_cents: 19900, rooms: 8 }
    ]);
  }

  console.log('Migration + seed completed.');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
