import sqlite3 from 'sqlite3';
const dbName = 'db.db';

const db = new sqlite3.Database(dbName, (error) => {
  if (error) {
    console.error(error.message);
  } else {
    console.log("Connected to db");
    db.serialize(() => {
      // Create users table
      db.run(`CREATE TABLE IF NOT EXISTS users (
        userid INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )`);

      // Create couples table
      db.run(`CREATE TABLE IF NOT EXISTS couples (
        coupleid INTEGER PRIMARY KEY AUTOINCREMENT,
        userid1 INTEGER NOT NULL,
        userid2 INTEGER NOT NULL,
        FOREIGN KEY (userid1) REFERENCES users(userid),
        FOREIGN KEY (userid2) REFERENCES users(userid)
      )`);

      // Create items table
      db.run(`CREATE TABLE IF NOT EXISTS items (
        itemid INTEGER PRIMARY KEY AUTOINCREMENT,
        userid INTEGER NOT NULL,
        description TEXT NOT NULL,
        value INTEGER NOT NULL,
        FOREIGN KEY (userid) REFERENCES users(userid)
      )`);
    });
  }
});

export default db;
