const db = require('../config/database.ts');

class ITManager {
  static getAll() {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM IT_Manager', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

  static getById(id) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM IT_Manager WHERE id = ?', [id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  }

  static create(managerData) {
    return new Promise((resolve, reject) => {
      const { FName, username, password, mobile, gender } = managerData;

      db.query(
        `INSERT INTO IT_Manager (FName, username, password, mobile, gender)
         VALUES (?, ?, ?, ?, ?)`,
        [FName, username, password, mobile, gender],
        (err, result) => {
          if (err) return reject(err);
          resolve(result.insertId);
        }
      );
    });
  }

  static update(id, managerData) {
    return new Promise((resolve, reject) => {
      const { FName, username, password, mobile, gender } = managerData;

      db.query(
        `UPDATE IT_Manager SET 
         FName = ?, username = ?, password = ?, mobile = ?, gender = ?
         WHERE id = ?`,
        [FName, username, password, mobile, gender, id],
        (err, result) => {
          if (err) return reject(err);
          resolve(result.affectedRows > 0);
        }
      );
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM IT_Manager WHERE id = ?', [id], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  }

  static authenticate(username, password) {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM IT_Manager WHERE username = ? AND password = ?',
        [username, password],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0]);
        }
      );
    });
  }
}

module.exports = ITManager;
