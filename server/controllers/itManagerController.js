const ITManager = require('../models/itManagerModel');
const Doctor = require('../models/doctorModel');
const Nurse = require('../models/nurseModel');
const Patient = require('../models/patientModel');
const Receptionist = require('../models/receptionistModel');
const req = require('express/lib/request');

exports.testRoute = (_, res) => {
  res.send('IT Manager test route works!');
};

exports.renderAddITManagerForm = async (res) => {
  try {
    res.render('it-manager/add');
  } catch (error) {
    console.error('Error rendering add IT manager form:', error);
    res.status(500).render('errors/500', { error: 'Failed to load add IT manager form' });
  }
};

exports.addITManager = async (req, res) => {
  try {
    const { FName, gender, username, password, mobile } = req.body;
    console.log({ gender });
    // Create IT manager
    await ITManager.create({
      FName,
      gender: req.body.Male ? 'Male' : 'Female',
      username,
      password,
      mobile,
    });

    res.redirect('/it-manager/home');
  } catch (error) {
    console.error('Error adding IT manager:', error);
    res.status(500).render('errors/500', { error: 'Failed to add IT manager' });
  }
};

exports.renderITManagerHome = async (_, res) => {
  try {
    const itManagers = await ITManager.getAll();
    const doctors = await Doctor.getAll();
    const patients = await Patient.getAll();
    const nurses = await Nurse.getAll();
    const receptionists = await Receptionist.getAll();

    res.render('it-manager/home', {
      IT_Manager: itManagers,
      doctors,
      patients,
      nurses,
      Receptionist: receptionists,
    });
  } catch (error) {
    console.error('Error rendering IT manager home:', error);
    res.status(500).render('errors/500', { error: 'Failed to load IT manager home' });
  }
};

exports.renderAddDoctorForm = async (_, res) => {
  try {
    // Render the add doctor form view
    res.render('it-manager/add-doctor');
  } catch (error) {
    console.error('Error rendering add doctor form:', error);
    res.status(500).render('errors/500', { error: 'Failed to load add doctor form' });
  }
};

exports.addDoctor = async (req, res) => {
  try {
    const { FName, gender, username, password, specialization, mobile, city, street, buildingNo } =
      req.body;
    console.log({ gender });
    // Create doctor
    await Doctor.create({
      FName,
      gender: req.body.Male ? 'Male' : 'Female',
      username,
      password,
      specialization,
      mobile,
      city,
      street,
      buildingNo,
    });

    // Redirect to IT manager home page after successful creation
    res.redirect('/it-manager/home');
  } catch (error) {
    console.error('Error adding doctor:', error);
    res.status(500).render('errors/500', { error: 'Failed to add doctor' });
  }
};

exports.addNurse = async (req, res) => {
  try {
    const { Name, phone, username, password, floor } = req.body;

    // Create nurse
    await Nurse.create({
      Name,
      gender: req.body.Male ? 'Male' : 'Female',
      username,
      password,
      phone,
      floor,
    });

    // Redirect to IT manager home page after successful creation
    res.redirect('/it-manager/home');
  } catch (error) {
    console.error('Error adding nurse:', error);
    res.status(500).render('errors/500', { error: 'Failed to add nurse' });
  }
};

exports.renderAddNurseForm = async (req, res) => {
  try {
    // Render the add nurse form view
    res.render('nurse/add', { role: req.session.role });
  } catch (error) {
    console.error('Error rendering add nurse form:', error);
    res.status(500).render('errors/500', { error: 'Failed to load add nurse form' });
  }
};

exports.deleteNurse = async (req, res) => {
  try {
    const nurseId = req.params.id;
    const success = await Nurse.delete(nurseId);

    if (!success) {
      return res.status(404).render('errors/404', { error: 'Nurse not found' });
    }

    res.redirect('/it-manager/home');
  } catch (error) {
    console.error('Error deleting nurse:', error);
    res.status(500).render('errors/500', { error: 'Failed to delete nurse' });
  }
};

exports.renderEditITManagerForm = async (req, res) => {
  try {
    const managerId = req.params.id;
    const manager = await ITManager.getById(managerId);

    if (!manager) {
      return res.status(404).render('errors/404', { error: 'IT Manager not found' });
    }

    res.render('it-manager/edit', { manager });
  } catch (error) {
    console.error('Error rendering edit IT manager form:', error);
    res.status(500).render('errors/500', { error: 'Failed to load edit IT manager form' });
  }
};

exports.updateITManager = async (req, res) => {
  try {
    const managerId = req.params.id;
    const { FName, gender, username, password, mobile } = req.body;
    console.log({ gender });
    const success = await ITManager.update(managerId, {
      FName,
      gender: req.body.Male ? 'Male' : 'Female',
      username,
      password,
      mobile,
    });

    if (!success) {
      return res.status(404).render('errors/404', { error: 'IT Manager not found' });
    }

    res.redirect('/it-manager/home');
  } catch (error) {
    console.error('Error updating IT manager:', error);
    res.status(500).render('errors/500', { error: 'Failed to update IT manager' });
  }
};

exports.deleteITManager = async (req, res) => {
  try {
    const managerId = req.params.id;
    const success = await ITManager.delete(managerId);

    if (!success) {
      return res.status(404).render('errors/404', { error: 'IT Manager not found' });
    }

    res.redirect('/it-manager/home');
  } catch (error) {
    console.error('Error deleting IT manager:', error);
    res.status(500).render('errors/500', { error: 'Failed to delete IT manager' });
  }
};
exports.isITManager = (req, res, next) => {
  if (req.session.role === 'it-manager') {
    return next();
  }
  res.status(403).render('errors/403', { message: 'Access denied. IT Managers only.' });
};
exports.renderPatientProfile = async (req, res) => {
  try {
    const patientId = req.params.id;
    const patient = await Patient.getById(patientId);
    const nurses = await Nurse.getAll();

    if (!patient) {
      return res.status(404).render('errors/404', { error: 'Patient not found' });
    }

    res.render('patient/profile-base', {
      patients: [patient],
      nurses,
      role: 'it-manager',
    });
  } catch (error) {
    console.error('Error rendering patient profile:', error);
    res.status(500).render('errors/500', { error: 'Failed to load patient profile' });
  }
};

exports.renderDoctorProfile = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const doctor = await Doctor.getById(doctorId);

    if (!doctor) {
      return res.status(404).render('errors/404', { error: 'Doctor not found' });
    }

    res.render('it-manager/doctor-profile', { Doctors: [doctor] });
  } catch (error) {
    console.error('Error rendering doctor profile:', error);
    res.status(500).render('errors/500', { error: 'Failed to load doctor profile' });
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
    const { Name, phone, username, password, floor } = req.body;

    // Get existing nurse data
    const existingNurse = await Nurse.getById(nurseId);

    if (!existingNurse) {
      return res.status(404).render('errors/404', { error: 'Nurse not found' });
    }

    // Prepare update data
    const updateData = {
      Name,
      gender: req.body.Male ? 'Male' : 'Female',
      username,
      phone,
      floor,
    };

    // Only update password if provided
    if (password && password.trim() !== '') {
      updateData.password = password;
    } else {
      updateData.password = existingNurse.password; // Keep existing password
    }

    // Update nurse
    const success = await Nurse.update(nurseId, updateData);

    if (!success) {
      return res.status(500).render('errors/500', { error: 'Failed to update nurse' });
    }

    res.redirect('/it-manager/home');
  } catch (error) {
    console.error('Error updating nurse:', error);
    res.status(500).render('errors/500', { error: 'Failed to update nurse' });
  }
};

exports.renderAddReceptionistForm = async (_, res) => {
  try {
    res.render('receptionist/add');
  } catch (error) {
    console.error('Error rendering add receptionist form:', error);
    res.status(500).render('errors/500', { error: 'Failed to load add receptionist form' });
  }
};

exports.addReceptionist = async (req, res) => {
  try {
    const { FName, username, password, mobile } = req.body;

    // Create receptionist
    await Receptionist.create({
      FName,
      gender: req.body.Male ? 'Male' : 'Female',
      username,
      password,
      mobile,
    });

    // Redirect to IT manager home page
    res.redirect('/it-manager/home');
  } catch (error) {
    console.error('Error adding receptionist:', error);
    res.status(500).render('errors/500', { error: 'Failed to add receptionist' });
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
    const { FName, username, password, mobile } = req.body;

    // Get existing receptionist data
    const existingReceptionist = await Receptionist.getById(receptionistId);

    if (!existingReceptionist) {
      return res.status(404).render('errors/404', { error: 'Receptionist not found' });
    }

    // Prepare update data
    const updateData = {
      FName,
      gender: req.body.Male ? 'Male' : 'Female',
      username,
      mobile,
    };

    // Only update password if provided
    if (password && password.trim() !== '') {
      updateData.password = password;
    } else {
      updateData.password = existingReceptionist.password; // Keep existing password
    }

    // Update receptionist
    const success = await Receptionist.update(receptionistId, updateData);

    if (!success) {
      return res.status(500).render('errors/500', { error: 'Failed to update receptionist' });
    }

    res.redirect('/it-manager/home');
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
