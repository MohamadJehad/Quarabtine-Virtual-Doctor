const ITManager = require('../models/itManagerModel');
const Doctor = require('../models/doctorModel');
const Nurse = require('../models/nurseModel');
const Patient = require('../models/patientModel');
const Receptionist = require('../models/receptionistModel');

exports.testRoute = (req, res) => {
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

exports.renderAddDoctorForm = async (req, res) => {
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
    const { 
      FName, 
      gender, 
      username, 
      password, 
      specialization, 
      mobile, 
      city, 
      street, 
      buildingNo 
    } = req.body;

    // Create doctor
    const doctorId = await Doctor.create({
      FName,
      gender: req.body.Male ? 'Male' : 'Female',
      username,
      password,
      specialization,
      mobile,
      city,
      street,
      buildingNo
    });

    // Redirect to IT manager home page after successful creation
    res.redirect('/it-manager/home');
  } catch (error) {
    console.error('Error adding doctor:', error);
    res.status(500).render('errors/500', { error: 'Failed to add doctor' });
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

exports.renderPatientProfile = async (req, res) => {
  try {
    const patientId = req.params.id;
    const patient = await Patient.getById(patientId);
    const nurses = await Nurse.getAll();

    if (!patient) {
      return res.status(404).render('errors/404', { error: 'Patient not found' });
    }

    res.render('it-manager/patient-profile', {
      patients: [patient],
      nurses,
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
