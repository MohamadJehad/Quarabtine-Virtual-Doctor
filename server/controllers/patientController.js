const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

exports.renderAddPatientForm = async (res) => {
  try {
    const doctors = await Doctor.getAll();
    res.render('patient/add', { doctors });
  } catch (error) {
    console.error('Error rendering add patient form:', error);
    res.status(500).render('errors/500', { error: 'Failed to load add patient form' });
  }
};

exports.addPatient = async (req, res) => {
  try {
    const {
      FName,
      //   gender,
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
      return res.status(400).render('patient/add', {
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

    res.redirect(`/patient/health-questionnaire?id=${patientId}`);
  } catch (error) {
    console.error('Error adding patient:', error);
    res.status(500).render('errors/500', { error: 'Failed to add patient' });
  }
};

exports.renderHealthQuestionnaire = (req, res) => {
  const patientId = req.query.id;
  res.render('patient/health-questionnaire', { patientId });
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

    res.redirect(`/patient/select-room?id=${patientId}`);
  } catch (error) {
    console.error('Error submitting health questionnaire:', error);
    res.status(500).render('errors/500', { error: 'Failed to submit health questionnaire' });
  }
};

exports.renderRoomSelection = async (req, res) => {
  try {
    const patientId = req.query.id;
    const occupiedRooms = await Patient.getOccupiedRooms();

    res.render('patient/select-room', { patientId, occupiedRooms });
  } catch (error) {
    console.error('Error rendering room selection:', error);
    res.status(500).render('errors/500', { error: 'Failed to load room selection' });
  }
};

exports.assignRoom = async (req, res) => {
  try {
    const { patientId, roomId } = req.body;

    await Patient.updateRoom(patientId, roomId);

    // Redirect based on user role
    if (req.session.role === 'IT_Manager') {
      res.redirect('/it-manager/home');
    } else if (req.session.role === 'receptionist') {
      res.redirect('/receptionist/home');
    } else {
      res.redirect('/');
    }
  } catch (error) {
    console.error('Error assigning room:', error);
    res.status(500).render('errors/500', { error: 'Failed to assign room' });
  }
};
