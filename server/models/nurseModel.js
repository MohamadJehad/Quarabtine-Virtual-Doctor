const db = require('../config/database.ts');

class Nurse {
  static getAll() {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM nurse', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

  static getById(id) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM nurse WHERE id = ?', [id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  }

  static getByFloor(floor) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM nurse WHERE floor = ?', [floor], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

  static create(nurseData) {
    return new Promise((resolve, reject) => {
      const { Name, username, password, phone, gender, floor } = nurseData;

      db.query(
        `INSERT INTO nurse (Name, username, password, phone, gender, floor)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [Name, username, password, phone, gender, floor],
        (err, result) => {
          if (err) return reject(err);
          resolve(result.insertId);
        }
      );
    });
  }

  static updateFloor(id, floorData) {
    const floorValue = floorData?.floor;

    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE nurse SET 
         floor = ?
         WHERE id = ?`,
        [Number(floorValue), id],
        (err, result) => {
          if (err) return reject(err);
          resolve(result.affectedRows > 0);
        }
      );
    });
  }
  static update(id, nurseData) {
    return new Promise((resolve, reject) => {
      const { Name, username, password, phone, gender, floor } = nurseData;

      db.query(
        `UPDATE nurse SET 
         Name = ?, username = ?, password = ?, phone = ?, gender = ?, floor = ?
         WHERE id = ?`,
        [Name, username, password, phone, gender, floor, id],
        (err, result) => {
          if (err) return reject(err);
          resolve(result.affectedRows > 0);
        }
      );
    });
  }
  static delete(id) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          // Delete related records first
          await db.promise().query('DELETE FROM n_monitor_p WHERE nurse_id = ?', [id]);

          // Delete the nurse
          const result = await db.promise().query('DELETE FROM nurse WHERE id = ?', [id]);
          resolve(result[0].affectedRows > 0);
        } catch (err) {
          reject(err);
        }
      })();
    });
  }

  static authenticate(username, password) {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM nurse WHERE username = ? AND password = ?',
        [username, password],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0]);
        }
      );
    });
  }

  static getPatientMonitoring(nurseId) {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT p.*, n.date, n.time 
         FROM patient p 
         JOIN n_monitor_p n ON p.ID = n.patient_id 
         WHERE n.nurse_id = ?`,
        [nurseId],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  }

  static addPatientMonitoring(nurseId, patientId) {
    return new Promise((resolve, reject) => {
      const currentDate = new Date().toISOString().slice(0, 10);
      const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false });

      db.query(
        `INSERT INTO n_monitor_p (date, time, nurse_id, patient_id)
         VALUES (?, ?, ?, ?)`,
        [currentDate, currentTime, nurseId, patientId],
        (err, result) => {
          if (err) return reject(err);
          resolve(result.insertId);
        }
      );
    });
  }
}

module.exports = Nurse;
