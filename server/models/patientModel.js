const db = require('../config/database.ts');

class Patient {
  static getAll() {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT p.ID, p.FName, p.gender, p.birthDate, p.weight, p.mobile, 
         p.city, p.street, p.buildingNo, p.room_id, doctor.FName as assigned_doctor 
         FROM patient as p 
         JOIN doctor ON p.doctor_id = doctor.ID`,
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  }

  static getById(id) {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT p.ID, p.FName, p.gender, p.birthDate, p.weight, p.mobile, 
         p.city, p.street, p.buildingNo, p.room_id, doctor.FName as assigned_doctor 
         FROM patient as p 
         JOIN doctor ON p.doctor_id = doctor.ID
         WHERE p.ID = ?`,
        [id],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0]);
        }
      );
    });
  }

  static getByRoomIds(roomIds) {
    return new Promise((resolve, reject) => {
      // Convert array to comma-separated string for SQL IN clause
      const roomIdsString = roomIds.join(',');

      db.query(
        `SELECT p.ID, p.FName, p.gender, p.birthDate, p.weight, p.mobile, 
         p.city, p.street, p.buildingNo, p.room_id, doctor.FName as assigned_doctor 
         FROM patient as p 
         JOIN doctor ON p.doctor_id = doctor.ID
         WHERE p.room_id IN (${roomIdsString})`,
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  }

  static getByDoctorId(doctorId) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM patient WHERE doctor_id = ?', [doctorId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

  static getHealthIndicators(patientId) {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM healthIndicator WHERE patient_id = ?',
        [patientId],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  }

  static getSituations(patientId) {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM patient_situation WHERE patient_id = ?',
        [patientId],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  }

  static getStatus(patientId) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM patient_status WHERE patient_id = ?', [patientId], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  }

  static create(patientData) {
    return new Promise((resolve, reject) => {
      const {
        FName,
        gender,
        weight,
        birthDate,
        mobile,
        city,
        street,
        buildingNo,
        doctorId,
        roomId,
      } = patientData;

      db.query(
        `INSERT INTO patient (FName, gender, weight, birthDate, mobile, city, street, buildingNo, doctor_id, room_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [FName, gender, weight, birthDate, mobile, city, street, buildingNo, doctorId, roomId || 0],
        (err, result) => {
          if (err) return reject(err);
          resolve(result.insertId);
        }
      );
    });
  }

  static update(id, patientData) {
    return new Promise((resolve, reject) => {
      const { FName, gender, weight, birthDate, mobile, city, street, buildingNo, roomId } =
        patientData;

      db.query(
        `UPDATE patient SET 
         FName = ?, gender = ?, weight = ?, birthDate = ?, 
         mobile = ?, city = ?, street = ?, buildingNo = ?, room_id = ?
         WHERE ID = ?`,
        [FName, gender, weight, birthDate, mobile, city, street, buildingNo, roomId, id],
        (err, result) => {
          if (err) return reject(err);
          resolve(result.affectedRows > 0);
        }
      );
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      try {
        // Delete related records first
        db.promise().query('DELETE FROM n_monitor_p WHERE patient_id = ?', [id]);
        db.promise().query('DELETE FROM healthindicator WHERE patient_id = ?', [id]);
        db.promise().query('DELETE FROM patient_status WHERE patient_id = ?', [id]);
        db.promise().query('DELETE FROM patient_situation WHERE patient_id = ?', [id]);

        // Delete the patient
        const [result] = db.promise().query('DELETE FROM patient WHERE ID = ?', [id]);
        resolve(result.affectedRows > 0);
      } catch (err) {
        reject(err);
      }
    });
  }

  static addHealthStatus(statusData) {
    return new Promise((resolve, reject) => {
      const { patientId, bloodpressure, diabetes, heartdisease, pregnant, allergies } = statusData;

      db.query(
        `INSERT INTO patient_status (patient_id, bloodpressure, diabetes, heartdisease, pregnant, allergies)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [patientId, bloodpressure, diabetes, heartdisease, pregnant, allergies],
        (err, result) => {
          if (err) return reject(err);
          resolve(result.insertId);
        }
      );
    });
  }

  static addSituation(situationData) {
    return new Promise((resolve, reject) => {
      const { patientId, situation, medicine } = situationData;
      const currentDate = new Date().toISOString().slice(0, 10);
      const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false });

      db.query(
        `INSERT INTO patient_situation (Situation, Medicine, patient_id, date, time)
         VALUES (?, ?, ?, ?, ?)`,
        [situation, medicine, patientId, currentDate, currentTime],
        (err, result) => {
          if (err) return reject(err);
          resolve(result.insertId);
        }
      );
    });
  }

  static updateSituation(situationId, medicine) {
    return new Promise((resolve, reject) => {
      const currentDate = new Date().toISOString().slice(0, 10);
      const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false });

      db.query(
        `UPDATE patient_situation SET medicine = ?, date = ?, time = ? WHERE id = ?`,
        [medicine, currentDate, currentTime, situationId],
        (err, result) => {
          if (err) return reject(err);
          resolve(result.affectedRows > 0);
        }
      );
    });
  }

  static deleteSituation(situationId) {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM patient_situation WHERE id = ?', [situationId], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  }

  static updateRoom(patientId, roomId) {
    return new Promise((resolve, reject) => {
      db.query(
        'UPDATE patient SET room_id = ? WHERE ID = ?',
        [roomId, patientId],
        (err, result) => {
          if (err) return reject(err);
          resolve(result.affectedRows > 0);
        }
      );
    });
  }

  static getOccupiedRooms() {
    return new Promise((resolve, reject) => {
      db.query('SELECT room_id FROM patient', (err, results) => {
        if (err) return reject(err);
        resolve(results.map((row) => row.room_id));
      });
    });
  }
}

module.exports = Patient;
