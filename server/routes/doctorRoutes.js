const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { isAuthenticated, isDoctor } = require('../middleware/auth');

// Apply authentication middleware to all doctor routes
router.use(isAuthenticated, isDoctor);

// GET doctor home page
router.get('/home', doctorController.renderHomePage);

// GET patient profile
router.get('/patient/:id', doctorController.renderPatientProfile);

// POST start new measurement
router.post('/new-measure', doctorController.startNewMeasurement);

// POST add situation
router.post('/add-situation', doctorController.addSituation);

// POST update situation
router.post('/update-situation', doctorController.updateSituation);

// POST delete situation
router.post('/delete-situation', doctorController.deleteSituation);

// GET start video call
router.get('/video-call', doctorController.startVideoCall);

module.exports = router;
