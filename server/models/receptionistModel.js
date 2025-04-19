const db = require('../config/database.ts');

class Receptionist {
  static getAll() {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM Receptionist', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

  static getById(id) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM Receptionist WHERE id = ?', [id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  }

  static create(receptionistData) {
    return new Promise((resolve, reject) => {
      const { FName, username, password, mobile, gender } = receptionistData;

      db.query(
        `INSERT INTO Receptionist (FName, username, password, mobile, gender)
         VALUES (?, ?, ?, ?, ?)`,
        [FName, username, password, mobile, gender],
        (err, result) => {
          if (err) return reject(err);
          resolve(result.insertId);
        }
      );
    });
  }

  static update(id, receptionistData) {
    return new Promise((resolve, reject) => {
      const { FName, username, password, mobile, gender } = receptionistData;

      db.query(
        `UPDATE Receptionist SET 
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
      db.query('DELETE FROM Receptionist WHERE id = ?', [id], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  }

  static authenticate(username, password) {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM Receptionist WHERE username = ? AND password = ?',
        [username, password],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0]);
        }
      );
    });
  }

  static getAvailableRooms() {
    return new Promise((resolve, reject) => {
      db.query('SELECT room_id FROM patient', (err, results) => {
        if (err) return reject(err);
        // Extract occupied room IDs
        const occupiedRooms = results.map((row) => row.room_id);
        resolve(occupiedRooms);
      });
    });
  }
  static getAllPatientMonitoring() {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT n.*, p.FName as patient_name, p.room_id 
         FROM n_monitor_p n 
         JOIN patient p ON n.patient_id = p.ID
         ORDER BY n.date DESC, n.time DESC`,
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  }
}

module.exports = Receptionist;
