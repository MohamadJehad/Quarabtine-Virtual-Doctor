const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { isAuthenticated } = require('../middleware/auth');

// Apply authentication middleware to protected routes
router.use('/select-room', isAuthenticated);

// GET add patient form
router.get('/add', patientController.renderAddPatientForm);

// POST add patient
router.post('/add', patientController.addPatient);

// GET health questionnaire
router.get('/health-questionnaire', patientController.renderHealthQuestionnaire);

// POST health questionnaire
router.post('/health-questionnaire', patientController.submitHealthQuestionnaire);

// GET room selection
router.get('/select-room', patientController.renderRoomSelection);

// POST room assignment
router.post('/assign-room', patientController.assignRoom);

module.exports = router;
