const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
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

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Register endpoint
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Hash password
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            res.status(500).send('Error hashing password');
            return;
        }

        // Insert user into database
        db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err) => {
            if (err) {
                res.status(400).send('Username already exists');
                return;
            }
            res.status(201).send('User registered successfully');
        });
    });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Find user in the database
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
            res.status(500).send('Error finding user');
            return;
        }

        if (!row) {
            res.status(404).send('User not found');
            return;
        }

        // Compare passwords
        bcrypt.compare(password, row.password, (err, result) => {
            if (err) {
                res.status(500).send('Error comparing passwords');
                return;
            }

            if (!result) {
                res.status(401).send('Incorrect password');
                return;
            }

            res.status(200).send('Login successful');
        });
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
