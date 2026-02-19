import pg from "pg";

const options = { connectionString: process.env.DATABASE_URL };

// SSL required for hosted databases (e.g. Render)
if (process.env.NODE_ENV === "production") {
  options.ssl = { rejectUnauthorized: false };
}

const db = new pg.Client(options);
export default db;
