const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'health_tracker.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
db.serialize(() => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      age INTEGER,
      height INTEGER,
      gender TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Activities table
  db.run(`
    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      duration INTEGER NOT NULL,
      calories INTEGER NOT NULL,
      distance REAL,
      time TEXT,
      date DATE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Daily activity summary
  db.run(`
    CREATE TABLE IF NOT EXISTS daily_activity_summary (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      date DATE NOT NULL,
      steps INTEGER DEFAULT 0,
      distance REAL DEFAULT 0,
      calories INTEGER DEFAULT 0,
      active_minutes INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, date)
    )
  `);

  // Water logs table
  db.run(`
    CREATE TABLE IF NOT EXISTS water_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      date DATE NOT NULL,
      amount INTEGER NOT NULL,
      time TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Sleep logs table
  db.run(`
    CREATE TABLE IF NOT EXISTS sleep_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      date DATE NOT NULL,
      bed_time TEXT NOT NULL,
      wake_time TEXT NOT NULL,
      total_hours REAL NOT NULL,
      quality INTEGER,
      deep_sleep REAL,
      light_sleep REAL,
      rem_sleep REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, date)
    )
  `);

  // Weight logs table
  db.run(`
    CREATE TABLE IF NOT EXISTS weight_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      date DATE NOT NULL,
      weight REAL NOT NULL,
      bmi REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // User settings table
  db.run(`
    CREATE TABLE IF NOT EXISTS user_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      daily_steps_goal INTEGER DEFAULT 10000,
      daily_calories_goal INTEGER DEFAULT 500,
      daily_water_goal INTEGER DEFAULT 2000,
      glass_size INTEGER DEFAULT 200,
      daily_sleep_goal REAL DEFAULT 8.0,
      target_weight REAL,
      start_weight REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Create indexes
  db.run('CREATE INDEX IF NOT EXISTS idx_activities_user_date ON activities(user_id, date)');
  db.run('CREATE INDEX IF NOT EXISTS idx_daily_summary_user_date ON daily_activity_summary(user_id, date)');
  db.run('CREATE INDEX IF NOT EXISTS idx_water_logs_user_date ON water_logs(user_id, date)');
  db.run('CREATE INDEX IF NOT EXISTS idx_sleep_logs_user_date ON sleep_logs(user_id, date)');
  db.run('CREATE INDEX IF NOT EXISTS idx_weight_logs_user_date ON weight_logs(user_id, date)');

  console.log('✅ Database tables initialized');
});

module.exports = db;
