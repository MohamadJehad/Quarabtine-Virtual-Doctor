const express = require('express');
const router = express.Router();
const nurseController = require('../controllers/nurseController');
const { isAuthenticated, isNurse } = require('../middleware/auth');

// Apply authentication middleware to all nurse routes
router.use(isAuthenticated, isNurse);

// GET nurse home page
router.get('/home', nurseController.renderHomePage);

// // GET patient profile
// router.get('/patient/:id', nurseController.renderPatientProfile);

// // POST start new measurement
// router.post('/new-measure', nurseController.startNewMeasurement);

// // GET monitor patient
// router.get('/monitor-patient/:id', nurseController.renderMonitorPatient);

// // POST add monitoring record
// router.post('/add-monitoring', nurseController.addMonitoringRecord);

// // GET view health indicators
// router.get('/health-indicators/:id', nurseController.viewHealthIndicators);

// // GET start video call
// router.get('/video-call', nurseController.startVideoCall);

module.exports = router;
