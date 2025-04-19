const express = require('express');
const router = express.Router();
const itManagerController = require('../controllers/itManagerController');
const { isAuthenticated, isITManager } = require('../middleware/auth');

// Apply authentication middleware to all IT manager routes
router.use(isAuthenticated, isITManager);

// // Add this route near the top, after the middleware
// router.get('/test', itManagerController.testRoute);

// GET IT manager home page
router.get('/home', itManagerController.renderITManagerHome);

// GET add doctor form
router.get('/add-doctor', itManagerController.renderAddDoctorForm);

// POST add doctor
router.post('/add-doctor', itManagerController.addDoctor);

// // GET add nurse form
// router.get('/add-nurse', itManagerController.renderAddNurseForm);

// // POST add nurse
// router.post('/add-nurse', itManagerController.addNurse);

// // GET add receptionist form
// router.get('/add-receptionist', itManagerController.renderAddReceptionistForm);

// // POST add receptionist
// router.post('/add-receptionist', itManagerController.addReceptionist);

// // GET add IT manager form
// router.get('/add-it-manager', itManagerController.renderAddITManagerForm);

// // POST add IT manager
// router.post('/add-it-manager', itManagerController.addITManager);

// // GET edit doctor form
// router.get('/edit-doctor/:id', itManagerController.renderEditDoctorForm);

// // POST update doctor
// router.post('/update-doctor/:id', itManagerController.updateDoctor);

// // POST delete doctor
// router.post('/delete-doctor/:id', itManagerController.deleteDoctor);

// // GET edit nurse form
// router.get('/edit-nurse/:id', itManagerController.renderEditNurseForm);

// // POST update nurse
// router.post('/update-nurse/:id', itManagerController.updateNurse);

// // POST delete nurse
// router.post('/delete-nurse/:id', itManagerController.deleteNurse);

// // GET edit receptionist form
// router.get('/edit-receptionist/:id', itManagerController.renderEditReceptionistForm);

// // POST update receptionist
// router.post('/update-receptionist/:id', itManagerController.updateReceptionist);

// // POST delete receptionist
// router.post('/delete-receptionist/:id', itManagerController.deleteReceptionist);

// // GET edit IT manager form
// router.get('/edit-it-manager/:id', itManagerController.renderEditITManagerForm);

// // POST update IT manager
// router.post('/update-it-manager/:id', itManagerController.updateITManager);

// // POST delete IT manager
// router.post('/delete-it-manager/:id', itManagerController.deleteITManager);

// // GET patient profile
// router.get('/patient/:id', itManagerController.renderPatientProfile);

module.exports = router;
