const Nurse = require('../models/nurseModel');
const Patient = require('../models/patientModel');

exports.renderAddNurseForm = async (req, res) => {
  try {
    res.render('nurse/add', { role: req.session.role });
  } catch (error) {
    console.error('Error rendering add nurse form:', error);
    res.status(500).render('errors/500', { error: 'Failed to load add nurse form' });
  }
};
exports.renderHomePage = async (req, res) => {
  try {
    const nurseId = req.session.nurseID;
    const nurse = await Nurse.getById(nurseId);

    if (!nurse) {
      return res.status(404).render('errors/404', { error: 'Nurse not found' });
    }

    // Get patients on the nurse's floor
    const floor = nurse.floor;
    const roomNumbers = [];

    for (let i = 0; i < 10; i++) {
      roomNumbers.push((floor - 1) * 10 + i + 1); // Adding 1 to start room numbers from 1
    }

    const patients = await Patient.getByRoomIds(roomNumbers);

    // Get monitoring assignments for this nurse
    const monitoringAssignments = await Nurse.getPatientMonitoring(nurseId);

    // Add monitoring status to each patient
    const patientsWithMonitoring = patients.map((patient) => {
      const isMonitored = monitoringAssignments.some(
        (assignment) => assignment.patient_id === patient.ID
      );
      return { ...patient, isMonitored };
    });

    res.render('nurse/home', {
      nurse,
      patients: patientsWithMonitoring,
      nurseID: nurseId,
      title: 'Nurse Dashboard',
    });
  } catch (error) {
    console.error('Error rendering nurse home page:', error);
    res.status(500).render('errors/500', { error: 'Failed to load nurse dashboard' });
  }
};
exports.renderPatientProfile = async (req, res) => {
  try {
    const patientId = req.query.id;
    const patient = await Patient.getById(patientId);
    const healthData = await Patient.getHealthIndicators(patientId);
    const situations = await Patient.getSituations(patientId);
    const status = await Patient.getStatus(patientId);
    res.render('patient/profile-base', {
      patients: [patient],
      health: healthData,
      history: situations,
      status: [status],
      showMeassure: false,
      roomId: 25, // Consider generating a unique room ID for video calls
      role: 'nurse',
    });
  } catch (error) {
    console.error('Error rendering patient profile:', error);
    res.status(500).render('errors/500', { error: 'Failed to load patient profile' });
  }
};

exports.addNurse = async (req, res) => {
  try {
    const { Name, gender, username, password, phone, floor } = req.body;
    console.log({ gender });
    // Create nurse
    const nurseId = await Nurse.create({
      Name,
      gender: req.body.Male ? 'Male' : 'Female',
      username,
      password,
      phone,
      floor,
    });
    console.log({ nurseId });

    // Redirect based on user role
    if (req.session.role === 'it-manager') {
      res.redirect('/it-manager/home');
    } else {
      res.redirect('/');
    }
  } catch (error) {
    console.error('Error adding nurse:', error);
    res.status(500).render('errors/500', { error: 'Failed to add nurse' });
  }
};

exports.renderNurseProfile = async (req, res) => {
  try {
    const nurseId = req.params.id;
    const nurse = await Nurse.getById(nurseId);

    if (!nurse) {
      return res.status(404).render('errors/404', { error: 'Nurse not found' });
    }

    res.render('nurse/profile', { nurse });
  } catch (error) {
    console.error('Error rendering nurse profile:', error);
    res.status(500).render('errors/500', { error: 'Failed to load nurse profile' });
  }
};

exports.renderEditNurseForm = async (req, res) => {
  try {
    const nurseId = req.params.id;
    const nurse = await Nurse.getById(nurseId);

    if (!nurse) {
      return res.status(404).render('errors/404', { error: 'Nurse not found' });
    }

    res.render('nurse/edit', { nurse });
  } catch (error) {
    console.error('Error rendering edit nurse form:', error);
    res.status(500).render('errors/500', { error: 'Failed to load edit nurse form' });
  }
};

exports.updateNurse = async (req, res) => {
  try {
    const nurseId = req.params.id;
    const { Name, gender, username, password, phone, floor } = req.body;
    console.log({ gender });
    const success = await Nurse.update(nurseId, {
      Name,
      gender: req.body.Male ? 'Male' : 'Female',
      username,
      password,
      phone,
      floor,
    });

    if (!success) {
      return res.status(404).render('errors/404', { error: 'Nurse not found' });
    }

    // Redirect based on user role
    if (req.session.role === 'it-manager') {
      res.redirect('/it-manager/home');
    } else {
      res.redirect('/nurse/profile/' + nurseId);
    }
  } catch (error) {
    console.error('Error updating nurse:', error);
    res.status(500).render('errors/500', { error: 'Failed to update nurse' });
  }
};

exports.deleteNurse = async (req, res) => {
  try {
    const nurseId = req.params.id;
    const success = await Nurse.delete(nurseId);

    if (!success) {
      return res.status(404).render('errors/404', { error: 'Nurse not found' });
    }

    // Redirect based on user role
    if (req.session.role === 'it-manager') {
      res.redirect('/it-manager/home');
    } else {
      res.redirect('/');
    }
  } catch (error) {
    console.error('Error deleting nurse:', error);
    res.status(500).render('errors/500', { error: 'Failed to delete nurse' });
  }
};

exports.renderNurseHome = async (req, res) => {
  try {
    const nurseId = req.session.nurseID;
    const nurse = await Nurse.getById(nurseId);

    if (!nurse) {
      return res.status(404).render('errors/404', { error: 'Nurse not found' });
    }

    // Get patients on the nurse's floor
    const floor = nurse.floor;
    const roomNumbers = [];

    for (let i = 0; i < 10; i++) {
      roomNumbers.push((floor - 1) * 10 + i);
    }

    const patients = await Patient.getByRoomIds(roomNumbers);

    res.render('nurse/home', { nurse, patients });
  } catch (error) {
    console.error('Error rendering nurse home:', error);
    res.status(500).render('errors/500', { error: 'Failed to load nurse home' });
  }
};

exports.addPatientMonitoring = async (req, res) => {
  try {
    const nurseId = req.session.nurseID;
    const patientId = req.body.patientId;

    await Nurse.addPatientMonitoring(nurseId, patientId);

    res.redirect(`/patient/profile/${patientId}`);
  } catch (error) {
    console.error('Error adding patient monitoring:', error);
    res.status(500).render('errors/500', { error: 'Failed to add patient monitoring' });
  }
};
