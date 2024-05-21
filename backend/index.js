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

// Endpoint to create a couple
app.post('/couples/create', (req, res) => {
  const { firstUser } = req.body;

  if (!firstUser) {
    return res.status(400).json({ error: 'First user is a required field' });
  }

  getUserId(firstUser, (err, userId) => {
    if (err) {
      console.error(err.message);
      return res.status(404).json({ error: 'User not found' });
    }

    db.run(
      `INSERT INTO couples (firstUserID, secondUserID) VALUES (?, ?)`,
      [userId, null],
      function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(200).send("success");
      }
    );
  });
});

// Endpoint to join a couple
app.post('/couples/join', (req, res) => {
  const { existingUser, newUser } = req.body;

  if (!existingUser || !newUser) {
    return res.status(400).json({ error: 'Both existingUser and newUser are required' });
  }

  getUserId(existingUser, (err, existingUserId) => {
    if (err) {
      console.error(err.message);
      return res.status(404).json({ error: 'Existing user not found' });
    }

    // Check if the couple exists for the existing user and has a null secondUserID
    db.get('SELECT * FROM couples WHERE firstUserID = ? AND secondUserID IS NULL', [existingUserId], (err, row) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (!row) {
        return res.status(404).json({ error: 'Couple not found or already has a second user' });
      }

      // Get the ID of the new user
      getUserId(newUser, (err, newUserId) => {
        if (err) {
          console.error(err.message);
          return res.status(404).json({ error: 'New user not found' });
        }

        // Check if the new user already belongs to another couple
        db.get('SELECT * FROM couples WHERE firstUserID = ? OR secondUserID = ?', [newUserId, newUserId], (err, row) => {
          if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal server error' });
          }
          if (row) {
            return res.status(400).json({ error: 'New user already belongs to another couple' });
          }

          // Update the couple with the new user ID
          db.run('UPDATE couples SET secondUserID = ? WHERE firstUserID = ?', [newUserId, existingUserId], function(err) {
            if (err) {
              console.error(err.message);
              return res.status(500).json({ error: 'Internal server error' });
            }
            res.status(200).json({ message: 'User joined the couple successfully' });
          });
        });
      });
    });
  });
});

// Endpoint to add an item
app.post('/items/add', (req, res) => {
  const { username, description, price } = req.body;

  // Check if username, description, and price are provided
  if (!username || !description || !price) {
    res.status(400).json({ error: 'username, description, and price are required fields' });
    return;
  }

  // Find the userid by joining the users table
  db.get(
    `SELECT userID FROM users WHERE username = ?`,
    [username],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      if (!row) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const userid = row.userID;

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
    }
  );
});

// Endpoint to retrieve item history for couples
app.get('/items/couplesHistory', (req, res) => {
  const { username } = req.body;

  // Check if username is provided
  if (!username) {
    res.status(400).json({ error: 'username is required' });
    return;
  }

  // Find the userid by joining the users table
  db.get(
    `SELECT userID FROM users WHERE username = ?`,
    [username],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      if (!row) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const userid = row.userID;

      db.all(`
        SELECT 
          items.itemid, 
          items.userid, 
          items.price, 
          items.description,
          users.username AS added_by_username
        FROM items
        INNER JOIN users ON items.userid = users.userID
        INNER JOIN couples ON items.userid = couples.firstUserID OR items.userid = couples.secondUserID
        WHERE couples.firstUserID = ? OR couples.secondUserID = ?
        ORDER BY items.itemid DESC
        LIMIT 10
      `,
      [userid, userid], 
      (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(rows);
      });
    }
  );
});

// Endpoint to retrieve all couples
app.get('/couples', (req, res) => {
  db.all('SELECT * FROM couples', (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(200).json(rows);
  });
});

// Endpoint to retrieve all users
app.get('/users', (req, res) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(200).json(rows);
  });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});