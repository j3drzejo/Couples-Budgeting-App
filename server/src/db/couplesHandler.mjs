import db from './database.mjs';

const findCouple = (firstUserID, secondUserId, callback) => {
  const sql = `SELECT * FROM couples WHERE userid1 = ? AND userid2 = ?`;
  db.get(sql, [firstUserID, secondUserId], (err, row) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, row);
    }
  });
};

const checkIfInCouple = (userid, callback) => {
  const sql = `SELECT * FROM couples WHERE userid1 = ? OR userid2 = ?`;
  db.get(sql, [userid, userid], (err, row) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, row);
    }
  });
};

const createCouple = (userId, callback) => {
  const sql = `INSERT INTO couples (userid1, userid2) VALUES (?, ?)`;
  db.run(sql, [userId, userId], function(err) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, { id: this.lastID });
    }
  });
};

const joinCouple = (coupleid, userid, callback) => {
  const sql = `UPDATE couples SET userid2 = ? WHERE id = ?`;
  db.run(sql, [userid, coupleid], function(err) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, { changes: this.changes });
    }
  });
};

export { findCouple, createCouple, joinCouple, checkIfInCouple };