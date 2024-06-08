import db from './database.mjs';
import { comparePassword, hashPassword } from '../utils/helpers.mjs'

const findUser = (username, password, callback) => {
  const sql = `SELECT * FROM users WHERE username = ?`;
  db.get(sql, [username], (err, row) => {
    if (err) {
      console.error(err.message);
      return callback(err, null);
    }
    if (!row) {
      // User not found
      return callback(null, null);
    }

    // Compare the provided password with the stored hashed password
    const isMatch = comparePassword(password, row.password);
    if (isMatch) {
      // Password matches
      return callback(null, row);
    } else {
      // Password does not match
      return callback(null, null);
    }
  });
};

const insertUser = (username, password, callback) => {
  const hashedPassword = hashPassword(password);
  const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;
  db.run(sql, [username, hashedPassword], function (err) {
    if (err) {
      console.error(err.message);
      return callback(err);
    }
    // Return the ID of the inserted user
    callback(null, this.lastID);
  });
};

const getAllUsers = (callback) => {
  const sql = `SELECT * FROM users`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return callback(err, null);
    }
    callback(null, rows);
  });
};

export { findUser, insertUser, getAllUsers };
