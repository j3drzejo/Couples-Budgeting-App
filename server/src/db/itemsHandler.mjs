import db from './database.mjs';

const insertItem = (userId, description, value, callback) => {
  const sql = `INSERT INTO items (userid, description, value, creationDate) VALUES (?, ?, ?, ?)`;
  const currentDate = new Date().toISOString();  // Get the current date in ISO format

  db.run(sql, [userId, description, value, currentDate], function(error) {
    if (error) {
      callback(error, null);
    } else {
      callback(null, this.lastID);
    }
  });
};

const findCoupleItems = (userId, callback) => {
  findCouple(userId, (error, couple) => {
    if (error) {
      callback(error, null);
    } else if (!couple) {
      callback(null, []); // No couple found
    } else {
      const sql = `SELECT * FROM items WHERE userid = ? OR userid = ?`;
      db.all(sql, [couple.userid1, couple.userid2], (error, rows) => {
        if (error) {
          callback(error, null);
        } else {
          callback(null, rows);
        }
      });
    }
  });
};

export { insertItem, findCoupleItems };