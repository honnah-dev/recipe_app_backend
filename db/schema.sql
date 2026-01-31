DROP TABLE IF EXISTS recipe_boards;
DROP TABLE IF EXISTS recipes;
DROP TABLE IF EXISTS boards;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE boards (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,  -- Added NOT NULL
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,  -- Added NOT NULL
  title VARCHAR(255) NOT NULL,
  description TEXT,
  source_url TEXT NOT NULL,
  image_url TEXT,
  prep_time INTEGER,
  cook_time INTEGER,
  servings INTEGER,
  ingredients JSONB NOT NULL, --array stored as JSONB
  instructions JSONB NOT NULL, --array stored as JSONB
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE recipe_boards (
  recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
  board_id INTEGER REFERENCES boards(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (recipe_id, board_id)
);