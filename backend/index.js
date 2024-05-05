const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Create database connection
const db = new sqlite3.Database('users.db');

// Create users table if not exists
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS couples (
  coupleID INTEGER PRIMARY KEY AUTOINCREMENT,
  firstUser INTEGER, 
  secondUser INTEGER
)`);

db.run(`CREATE TABLE IF NOT EXISTS items (
  itemid INTEGER PRIMARY KEY AUTOINCREMENT,
  userid INTEGER,
  description TEXT
)`);

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Register endpoint
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    console.log(username, password);

    // Hash password
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err) => {
      if (err) {
          res.status(400).send('Username already exists');
          return;
      }
      res.status(201).send('User registered successfully'); 
    });
});

// Get all users endpoint
app.get('/users', (req, res) => {
  // Select all users from the database
  db.all('SELECT * FROM users', (err, rows) => {
      if (err) {
          res.status(500).send('Error fetching users');
          return;
      }
      res.status(200).json(rows);
  });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});