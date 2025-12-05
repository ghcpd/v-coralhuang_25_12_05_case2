-- Users
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  preferences TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tours
CREATE TABLE IF NOT EXISTS tours (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  price_cents INTEGER NOT NULL,
  available_from DATE,
  available_to DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Flights (simplified)
CREATE TABLE IF NOT EXISTS flights (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  depart_date DATE,
  return_date DATE,
  price_cents INTEGER NOT NULL,
  airline TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Hotels
CREATE TABLE IF NOT EXISTS hotels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  location TEXT,
  price_cents INTEGER NOT NULL,
  rooms INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  type TEXT NOT NULL, -- 'tour', 'flight', 'hotel'
  item_id INTEGER NOT NULL,
  booking_data TEXT, -- JSON
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
