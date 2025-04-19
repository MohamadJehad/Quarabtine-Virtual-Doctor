const express = require('express');
const router = express.Router();
const receptionistController = require('../controllers/receptionistController');
const { isAuthenticated, isReceptionist } = require('../middleware/auth');

// Apply authentication middleware to all receptionist routes
router.use(isAuthenticated, isReceptionist);

// GET receptionist home page
router.get('/home', receptionistController.renderReceptionistHome);

// GET add patient form
router.get('/add-patient', receptionistController.renderAddPatientForm);

// POST add patient
router.post('/add-patient', receptionistController.addPatient);

// GET health questionnaire
router.get('/health-questionnaire', receptionistController.renderHealthQuestionnaire);

// POST health questionnaire
router.post('/health-questionnaire', receptionistController.submitHealthQuestionnaire);

// GET room selection
router.get('/select-room', receptionistController.renderRoomSelection);

// POST room assignment
router.post('/assign-room', receptionistController.assignRoom);

// GET patient profile
router.get('/patient/:id', receptionistController.renderPatientProfile);

// POST update nurse floor
router.post('/update-nurse-floor', receptionistController.updateNurseFloor);

module.exports = router;
