// Simple script to test database connection
// Run with: node --env-file=.env db/test-connection.js

import db from "./client.js";

async function testConnection() {
  try {
    await db.connect();
    console.log("Connected to database!");

    const result = await db.query("SELECT NOW()");
    console.log("Current time from database:", result.rows[0].now);

    const tables = await db.query(`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    `);
    console.log("Tables in database:", tables.rows.map(r => r.tablename));

    await db.end();
    console.log("Connection closed. Test passed!");
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
}

testConnection();
