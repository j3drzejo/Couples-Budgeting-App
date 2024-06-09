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

const leaveCouple = (userId, callback) => {
  const sql = `SELECT * FROM couples WHERE userid1 = ? OR userid2 = ?`;
  db.get(sql, [userId, userId], (error, row) => {
    if (error) {
      callback(error, null);
    } else if (!row) {
      callback({ message: 'User is not in any couple' }, null);
    } else if (row.userid1 == userId && row.userid2 != userId) {
      const sql = `UPDATE couples SET userid1 = ? WHERE coupleid = ?`;
      db.run(sql, [row.userid2, row.coupleid], function(error) {
        if (error) {
          callback(error, null);
        } else {
          callback(null, { changes: this.changes });
        }
      });
    } else if (row.userid2 == userId && row.userid1 != userId) {
      const sql = `UPDATE couples SET userid2 = ? WHERE coupleid = ?`;
      db.run(sql, [row.userid1, row.coupleid], function(error) {
        if (error) {
          callback(error, null);
        } else {
          callback(null, { changes: this.changes });
        }
      });
    } else {
      const sql = `DELETE FROM couples WHERE coupleid = ?`;
      db.run(sql, [row.coupleid], function(error) {
        if (error) {
          callback(error, null);
        } else {
          callback(null, { changes: this.changes });
        }
      });
    }
  });
};

const allCouples = (callback) => {
  const sql = `SELECT couples.*, users1.username as user1, users2.username as user2 
               FROM couples 
               LEFT JOIN users as users1 ON couples.userid1 = users1.userid 
               LEFT JOIN users as users2 ON couples.userid2 = users2.userid`;
  db.all(sql, (error, rows) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, rows);
    }
  });
};


export { findCouple, createCouple, joinCouple, checkIfInCouple, allCouples, leaveCouple  };