const Patient = require('../models/patientModel');
// const mqttService = require('../services/mqttService');
// const videoService = require('../services/videoService');

exports.renderHomePage = async (req, res) => {
  try {
    // Get the doctor ID from the session
    const doctorId = req.session.doctorID;

    // Get all patients assigned to this doctor
    const patients = await Patient.getByDoctorId(doctorId);

    // Render the doctor home page with the patients data
    res.render('doctor/home', {
      patients,
      title: 'Doctor Dashboard',
    });
  } catch (error) {
    console.error('Error rendering doctor home page:', error);
    res.status(500).render('errors/500', { error: 'Failed to load doctor dashboard' });
  }
};

exports.renderPatientProfile = async (req, res) => {
  try {
    const patientId = req.params.id;
    const patient = await Patient.getById(patientId);
    const healthData = await Patient.getHealthIndicators(patientId);
    const situations = await Patient.getSituations(patientId);
    const status = await Patient.getStatus(patientId);

    res.render('doctor/patientProfile', {
      patients: [patient],
      health: healthData,
      history: situations,
      status: [status],
      showMeassure: false,
      roomId: 25, // Consider generating a unique room ID for video calls
    });
  } catch (error) {
    console.error('Error rendering patient profile:', error);
    res.status(500).render('errors/500', { error: 'Failed to load patient profile' });
  }
};

exports.startNewMeasurement = async (req, res) => {
  try {
    const patientId = req.body.patientID;

    // Set the patient ID for measurement in MQTT service
    // mqttService.setPatientForMeasure(patientId);

    // // Trigger measurement via MQTT
    // mqttService.publishMessage('M11', 's');

    // Wait for measurement to complete
    setTimeout(async () => {
      const patient = await Patient.getById(patientId);
      const healthData = await Patient.getHealthIndicators(patientId);
      const situations = await Patient.getSituations(patientId);
      const status = await Patient.getStatus(patientId);

      res.render('doctor/patientProfile', {
        // patients: [patient],
        // health: healthData,
        // history: situations,
        // status: [status],
        showMeassure: true,
        roomId: 25,
      });
    }, 700); // Delay to allow time for measurement
  } catch (error) {
    console.error('Error starting new measurement:', error);
    res.status(500).render('errors/500', { error: 'Failed to start new measurement' });
  }
};

exports.addSituation = async (req, res) => {
  try {
    const { patientID, situation, medicine } = req.body;

    await Patient.addSituation({
      patientId: patientID,
      situation,
      medicine,
    });

    res.redirect(`/doctor/patient/${patientID}`);
  } catch (error) {
    console.error('Error adding situation:', error);
    res.status(500).render('errors/500', { error: 'Failed to add situation' });
  }
};

exports.updateSituation = async (req, res) => {
  try {
    const { situation_id, medicine, patientID } = req.body;

    await Patient.updateSituation(situation_id, medicine);

    res.redirect(`/doctor/patient/${patientID}`);
  } catch (error) {
    console.error('Error updating situation:', error);
    res.status(500).render('errors/500', { error: 'Failed to update situation' });
  }
};

exports.deleteSituation = async (req, res) => {
  try {
    const { situation_id, patientID } = req.body;

    await Patient.deleteSituation(situation_id);

    res.redirect(`/doctor/patient/${patientID}`);
  } catch (error) {
    console.error('Error deleting situation:', error);
    res.status(500).render('errors/500', { error: 'Failed to delete situation' });
  }
};

exports.startVideoCall = (req, res) => {
  //   const roomId = videoService.generateRoomId();
  //   req.session.roomID = roomId;
  res.redirect(`/video/room/${roomId}`);
};
