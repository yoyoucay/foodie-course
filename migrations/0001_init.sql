-- Initial schema for D1 (SQLite dialect).
-- Replaces the old initdb.js / enhance-db.js Postgres scripts.

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT
);

CREATE TABLE IF NOT EXISTS meals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  image TEXT NOT NULL,
  summary TEXT NOT NULL,
  instructions TEXT NOT NULL,
  creator TEXT NOT NULL,
  creator_email TEXT NOT NULL,
  prep_time INTEGER NOT NULL DEFAULT 0,
  cook_time INTEGER NOT NULL DEFAULT 0,
  servings INTEGER NOT NULL DEFAULT 1,
  difficulty TEXT NOT NULL DEFAULT 'medium',
  category TEXT NOT NULL DEFAULT 'other',
  ingredients TEXT NOT NULL DEFAULT '',
  tags TEXT NOT NULL DEFAULT '',
  views INTEGER NOT NULL DEFAULT 0,
  rating_sum INTEGER NOT NULL DEFAULT 0,
  rating_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_meals_category ON meals (category);
CREATE INDEX IF NOT EXISTS idx_meals_difficulty ON meals (difficulty);
CREATE INDEX IF NOT EXISTS idx_meals_created_at ON meals (created_at);
