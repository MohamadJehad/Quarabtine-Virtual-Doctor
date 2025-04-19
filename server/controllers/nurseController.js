const Nurse = require('../models/nurseModel');
const Patient = require('../models/patientModel');

exports.renderAddNurseForm = async (req, res) => {
  try {
    res.render('nurse/add');
  } catch (error) {
    console.error('Error rendering add nurse form:', error);
    res.status(500).render('errors/500', { error: 'Failed to load add nurse form' });
  }
};

exports.addNurse = async (req, res) => {
  try {
    const { Name, gender, username, password, phone, floor } = req.body;

    // Create nurse
    const nurseId = await Nurse.create({
      Name,
      gender: req.body.Male ? 'Male' : 'Female',
      username,
      password,
      phone,
      floor,
    });

    // Redirect based on user role
    if (req.session.role === 'IT_Manager') {
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
    if (req.session.role === 'IT_Manager') {
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
    if (req.session.role === 'IT_Manager') {
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
