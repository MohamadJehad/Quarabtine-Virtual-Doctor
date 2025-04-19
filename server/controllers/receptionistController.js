const Receptionist = require('../models/receptionistModel');
const Patient = require('../models/patientModel');
const Nurse = require('../models/nurseModel');

exports.renderAddReceptionistForm = async (req, res) => {
  try {
    res.render('receptionist/add');
  } catch (error) {
    console.error('Error rendering add receptionist form:', error);
    res.status(500).render('errors/500', { error: 'Failed to load add receptionist form' });
  }
};

exports.addReceptionist = async (req, res) => {
  try {
    const { FName, gender, username, password, mobile } = req.body;

    // Create receptionist
    const receptionistId = await Receptionist.create({
      FName,
      gender: req.body.Male ? 'Male' : 'Female',
      username,
      password,
      mobile,
    });

    // Redirect based on user role
    if (req.session.role === 'IT_Manager') {
      res.redirect('/it-manager/home');
    } else {
      res.redirect('/');
    }
  } catch (error) {
    console.error('Error adding receptionist:', error);
    res.status(500).render('errors/500', { error: 'Failed to add receptionist' });
  }
};

exports.renderReceptionistHome = async (req, res) => {
  try {
    const patients = await Patient.getAll();
    const nurses = await Nurse.getAll();
    const nursePatientMonitoring = await Nurse.getAllPatientMonitoring();

    res.render('receptionist/home', {
      patients,
      nurses,
      nmonitorp: nursePatientMonitoring,
    });
  } catch (error) {
    console.error('Error rendering receptionist home:', error);
    res.status(500).render('errors/500', { error: 'Failed to load receptionist home' });
  }
};

exports.renderEditReceptionistForm = async (req, res) => {
  try {
    const receptionistId = req.params.id;
    const receptionist = await Receptionist.getById(receptionistId);

    if (!receptionist) {
      return res.status(404).render('errors/404', { error: 'Receptionist not found' });
    }

    res.render('receptionist/edit', { receptionist });
  } catch (error) {
    console.error('Error rendering edit receptionist form:', error);
    res.status(500).render('errors/500', { error: 'Failed to load edit receptionist form' });
  }
};

exports.updateReceptionist = async (req, res) => {
  try {
    const receptionistId = req.params.id;
    const { FName, gender, username, password, mobile } = req.body;

    const success = await Receptionist.update(receptionistId, {
      FName,
      gender: req.body.Male ? 'Male' : 'Female',
      username,
      password,
      mobile,
    });

    if (!success) {
      return res.status(404).render('errors/404', { error: 'Receptionist not found' });
    }

    // Redirect based on user role
    if (req.session.role === 'IT_Manager') {
      res.redirect('/it-manager/home');
    } else {
      res.redirect('/receptionist/profile/' + receptionistId);
    }
  } catch (error) {
    console.error('Error updating receptionist:', error);
    res.status(500).render('errors/500', { error: 'Failed to update receptionist' });
  }
};

exports.deleteReceptionist = async (req, res) => {
  try {
    const receptionistId = req.params.id;
    const success = await Receptionist.delete(receptionistId);

    if (!success) {
      return res.status(404).render('errors/404', { error: 'Receptionist not found' });
    }

    res.redirect('/it-manager/home');
  } catch (error) {
    console.error('Error deleting receptionist:', error);
    res.status(500).render('errors/500', { error: 'Failed to delete receptionist' });
  }
};

exports.renderPatientProfile = async (req, res) => {
  try {
    const patientId = req.params.id;
    const patient = await Patient.getById(patientId);
    const nurses = await Nurse.getAll();

    if (!patient) {
      return res.status(404).render('errors/404', { error: 'Patient not found' });
    }

    res.render('receptionist/patient-profile', {
      patients: [patient],
      nurses,
    });
  } catch (error) {
    console.error('Error rendering patient profile:', error);
    res.status(500).render('errors/500', { error: 'Failed to load patient profile' });
  }
};

exports.updateNurseFloor = async (req, res) => {
  try {
    const nurseId = req.body.nurse_id;
    const floor = req.body.floor;

    await Nurse.update(nurseId, { floor });

    res.redirect('/receptionist/home');
  } catch (error) {
    console.error('Error updating nurse floor:', error);
    res.status(500).render('errors/500', { error: 'Failed to update nurse floor' });
  }
};

exports.renderRoomSelection = async (req, res) => {
  try {
    const patientId = req.query.id;
    const occupiedRooms = await Receptionist.getAvailableRooms();

    res.render('receptionist/select-room', { patientId, occupiedRooms });
  } catch (error) {
    console.error('Error rendering room selection:', error);
    res.status(500).render('errors/500', { error: 'Failed to load room selection' });
  }
};

exports.assignRoom = async (req, res) => {
  try {
    const { patientId, roomId } = req.body;

    await Patient.updateRoom(patientId, roomId);

    res.redirect('/receptionist/home');
  } catch (error) {
    console.error('Error assigning room:', error);
    res.status(500).render('errors/500', { error: 'Failed to assign room' });
  }
};

exports.renderAddPatientForm = async (req, res) => {
  try {
    const doctors = await Doctor.getAll();
    res.render('receptionist/add-patient', { doctors });
  } catch (error) {
    console.error('Error rendering add patient form:', error);
    res.status(500).render('errors/500', { error: 'Failed to load add patient form' });
  }
};

exports.addPatient = async (req, res) => {
  try {
    const {
      FName,
      gender,
      weight,
      birthDate,
      mobile,
      city,
      street,
      buildingNo,
      'doctor-list': doctorName,
    } = req.body;

    // Get doctor ID from name
    const doctors = await Doctor.getAll();
    const doctor = doctors.find((d) => d.FName === doctorName);

    if (!doctor) {
      return res.status(400).render('receptionist/add-patient', {
        doctors,
        error: 'Selected doctor not found',
      });
    }

    // Create patient
    const patientId = await Patient.create({
      FName,
      gender: req.body.Male ? 'Male' : 'Female',
      weight,
      birthDate,
      mobile,
      city,
      street,
      buildingNo,
      doctorId: doctor.ID,
      roomId: 0,
    });

    // Store patient ID in session for next steps
    req.session.patientID = patientId;

    res.redirect(`/receptionist/health-questionnaire?id=${patientId}`);
  } catch (error) {
    console.error('Error adding patient:', error);
    res.status(500).render('errors/500', { error: 'Failed to add patient' });
  }
};

exports.renderHealthQuestionnaire = (req, res) => {
  const patientId = req.query.id;
  res.render('receptionist/health-questionnaire', { patientId });
};

exports.submitHealthQuestionnaire = async (req, res) => {
  try {
    const { patientId, bloodpressure, diabetes, heartdisease, allergies, pregnant } = req.body;

    await Patient.addHealthStatus({
      patientId,
      bloodpressure,
      diabetes,
      heartdisease,
      pregnant,
      allergies,
    });

    res.redirect(`/receptionist/select-room?id=${patientId}`);
  } catch (error) {
    console.error('Error submitting health questionnaire:', error);
    res.status(500).render('errors/500', { error: 'Failed to submit health questionnaire' });
  }
};
