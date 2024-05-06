const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Create database connection
const db = new sqlite3.Database('users.db');

// creating tables
{
// Create users table if not exists
db.run(`CREATE TABLE IF NOT EXISTS users (
    userID INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS couples (
  coupleID INTEGER PRIMARY KEY AUTOINCREMENT,
  firstUserID INTEGER, 
  secondUserID INTEGER
)`);

db.run(`CREATE TABLE IF NOT EXISTS items (
  itemid INTEGER PRIMARY KEY AUTOINCREMENT,
  userid INTEGER,
  price INTEGER,
  description TEXT
)`);
}


// Middleware
app.use(bodyParser.json());
app.use(cors());

app.post('/users/register', (req, res) => {
  const { username, password } = req.body;

  // Check if userid, description, and price are provided
  if (!username || !password) {
    res.status(400).json({ error: 'username, password are required fields' });
    return;
  }

  // Insert data into the items table
  db.run(
    `INSERT INTO users (username, password) VALUES (?, ?)`,
    [username, password],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      // Return success message
      res.status(200).send("success");
    }
  );
});

app.post('/couples/create', (req, res) => {
  const { firstUser, secondUser } = req.body;

  // Check if userid, description, and price are provided
  if (!firstUser || !secondUser) {
    res.status(400).json({ error: 'users required are required fields' });
    return;
  }

  // Insert data into the items table
  db.run(
    `INSERT INTO couples (firstUser, secondUser) VALUES (?, ?)`,
    [firstUser, secondUser],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      // Return success message
      res.status(200).send("success");
    }
  );
});
  
app.post('/items/add', (req, res) => {
  const { userid, description, price } = req.body;

  // Check if userid, description, and price are provided
  if (!userid || !description || !price) {
    res.status(400).json({ error: 'userid, description, and price are required fields' });
    return;
  }

  // Insert data into the items table
  db.run(
    `INSERT INTO items (userid, description, price) VALUES (?, ?, ?)`,
    [userid, description, price],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      // Return success message
      res.status(200).send("success");
    }
  );
});

app.get('/items/couplesHistory', (req, res) => {
  const { userid } = req.body;

  // Check if userid is provided
  if (!userid) {
    res.status(400).json({ error: 'userid is required' });
    return;
  }

  db.all(`
    SELECT items.itemid, items.userid, items.price, items.description
    FROM items
    INNER JOIN couples ON items.userid = couples.firstUser OR items.userid = couples.secondUser
    WHERE couples.firstUser = ? OR couples.secondUser = ?
    ORDER BY items.itemid DESC
    LIMIT 10
  `,[userid, userid], (err, rows) => {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      res.json(rows);
  });
});

app.get('/', (req, res) => {
  db.all('SELECT * FROM items', (err, rows) =>{
    res.json(rows);
  })
})

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});