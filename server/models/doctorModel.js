const db = require('../config/database.ts');

class Doctor {
  static getAll() {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM doctor', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }
  static getById(id) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM doctor WHERE ID = ?', [id], (err, results) => {
        if (err) return reject(err);
        if (results.length === 0) return reject(new Error('Doctor not found'));
        const doctor = results[0];
        resolve(doctor);
      });
    });
  }

  static create(doctorData) {
    return new Promise((resolve, reject) => {
      const {
        FName,
        gender,
        username,
        password,
        specialization,
        mobile,
        city,
        street,
        buildingNo,
      } = doctorData;

      db.query(
        `INSERT INTO doctor (FName, gender, username, password, specialization, mobile, city, street, buildingNo)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [FName, gender, username, password, specialization, mobile, city, street, buildingNo],
        (err, result) => {
          if (err) return reject(err);
          resolve(result.insertId);
        }
      );
    });
  }

  static update(doctorData) {
    return new Promise((resolve, reject) => {
      const {
        ID,
        FName,
        gender,
        username,
        password,
        specialization,
        mobile,
        city,
        street,
        buildingNo,
        birthDate,
      } = doctorData;

      db.query(
        `UPDATE doctor SET 
         FName = ?, gender = ?, username = ?, password = ?, 
         specialization = ?, mobile = ?, city = ?, street = ?, 
         buildingNo = ?, birthDate = ? 
         WHERE ID = ?`,
        [
          FName,
          gender,
          username,
          password,
          specialization,
          mobile,
          city,
          street,
          buildingNo,
          birthDate,
          ID,
        ],
        (err, result) => {
          if (err) return reject(err);
          resolve(result.affectedRows > 0);
        }
      );
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM doctor WHERE ID = ?', [id], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  }

  static authenticate(username, password) {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM doctor WHERE username = ? AND password = ?',
        [username, password],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0]);
        }
      );
    });
  }
}

module.exports = Doctor;
