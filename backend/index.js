const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const JWT = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3001;

// Create database connection
const db = new sqlite3.Database('db.db');

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

function getUserId(username, callback) {
  const query = "SELECT userID FROM users WHERE username = ?";
  db.get(query, [username], (err, row) => {
      if (err) {
          return callback(err, null);
      }
      if (!row) {
          // User not found
          return callback(null, null);
      }
      callback(null, row.userID);
  });
}

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.post('/users/register', async (req, res) => {
  const { username, password } = req.body;

  // Check if userid, description, and price are provided
  if (!username || !password) {
    res.status(400).json({ error: 'username, password are required fields' });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert data into the items table
  db.run(
    `INSERT INTO users (username, password) VALUES (?, ?)`,
    [username, hashedPassword],
    async function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      const token = await JWT.sign({ username }, "secret",{expiresIn: 6000 * 60});

      res.json({token, username});
    }
  );
});

app.post('/users/login', async (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required fields' });
    return;
  }

  // Query the database to find the user by username
  db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // If user not found
    if (!user) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    // Generate JWT token
    const token = await JWT.sign({ username: user.username }, "secret", { expiresIn: '1h' });

    res.json({ token });
  });
});

app.post('/couples/create', (req, res) => {
  const { firstUser } = req.body;
  

  // Check if userid, description, and price are provided
  if (!firstUser) {
    res.status(400).json({ error: 'users required are required fields' });
    return;
  }

  // Insert data into the items table
  db.run(
    `INSERT INTO couples (firstUser, secondUser) VALUES (?, ?)`,
    [getUserId(firstUser), null],
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

// Endpoint to join a couple
app.post('/couples/join', (req, res) => {
  const { username, coupleID } = req.body;

  // Check if the couple exists
  db.get('SELECT * FROM couples WHERE coupleID = ?', [coupleID], (err, row) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Couple not found' });
    }

    // If the secondUserID is not null, the couple is already full
    if (row.secondUserID !== null) {
      return res.status(400).json({ error: 'Couple already has two users' });
    }

    // Update the couple with the user ID
    db.run('UPDATE couples SET secondUserID = ? WHERE coupleID = ?', [getUserId(username), coupleID], function(err) {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.status(200).json({ message: 'User joined the couple successfully' });
    });
  });
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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});