const Doctor = require('../models/doctorModel');
const Nurse = require('../models/nurseModel');
const ITManager = require('../models/itManagerModel');
const Receptionist = require('../models/receptionistModel');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check doctor credentials
    const doctor = await Doctor.authenticate(username, password);
    if (doctor) {
      req.session.authenticated = true;
      req.session.doctorID = doctor.ID;
      req.session.role = 'doctor';
      return res.redirect('/doctor/home');
    }

    // Check nurse credentials
    const nurse = await Nurse.authenticate(username, password);
    if (nurse) {
      req.session.authenticated = true;
      req.session.nurseID = nurse.id;
      req.session.role = 'nurse';
      return res.redirect('/nurse/home');
    }

    // Check IT Manager credentials
    const itManager = await ITManager.authenticate(username, password);
    if (itManager) {
      req.session.authenticated = true;
      req.session.role = 'it-manager';
      return res.redirect('/it-manager/home');
    }

    // Check receptionist credentials
    const receptionist = await Receptionist.authenticate(username, password);
    if (receptionist) {
      req.session.authenticated = true;
      req.session.role = 'receptionist';
      return res.redirect('/receptionist/home');
    }

    // If no valid credentials found
    return res.status(401).render('auth/login', { error: 'Invalid username or password' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).render('errors/500', { error: 'An error occurred during login' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/');
  });
};

exports.renderLoginPage = (_, res) => {
  res.render('auth/login');
};
