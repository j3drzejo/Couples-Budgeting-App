import db from './database.mjs';

const findCouple = (userId, callback) => {
  const sql = `SELECT * FROM couples WHERE userid1 = ? OR userid2 = ?`;
  db.get(sql, [userId, userId], (error, row) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, row);
    }
  });
};

const checkIfInCouple = (userid, callback) => {
  const sql = `SELECT * FROM couples WHERE userid1 = ? OR userid2 = ?`;
  db.get(sql, [userid, userid], (error, row) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, row);
    }
  });
};

const createCouple = (userId, callback) => {
  const sql = `INSERT INTO couples (userid1, userid2) VALUES (?, ?)`;
  db.run(sql, [userId, userId], function(error) {
    if (error) {
      callback(error, null);
    } else {
      callback(null, { id: this.lastID });
    }
  });
};

const joinCouple = (coupleid, userid, callback) => {
  const sql = `UPDATE couples SET userid2 = ? WHERE coupleid = ?`;
  db.run(sql, [userid, coupleid], function(error) {
    if (error) {
      callback(error, null);
    } else {
      callback(null, { changes: this.changes });
    }
  });
};

const allCouples = (callback) => {
  const sql = `SELECT * FROM couples`;
  db.all(sql, (error, rows) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, rows);
    }
  });
};

export { findCouple, createCouple, joinCouple, checkIfInCouple, allCouples };