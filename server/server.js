require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Doctor = require('./models/doctorModel');
const Patient = require('./models/patientModel');
const Nurse = require('./models/nurseModel');
const ITManager = require('./models/itManagerModel');
const Receptionist = require('./models/receptionistModel');

app.get('/api/doctors', async (res) => {
  try {
    const doctors = await Doctor.getAll();
    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
});

app.get('/api/patients', async (res) => {
  try {
    const doctors = await Patient.getAll();
    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
});

// Get all nurses
app.get('/api/nurses', async (res) => {
  try {
    const nurses = await Nurse.getAll();
    res.status(200).json({
      success: true,
      count: nurses.length,
      data: nurses,
    });
  } catch (error) {
    console.error('Error fetching nurses:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
});

// Get all IT managers
app.get('/api/it-managers', async (res) => {
  try {
    const managers = await ITManager.getAll();
    res.status(200).json({
      success: true,
      count: managers.length,
      data: managers,
    });
  } catch (error) {
    console.error('Error fetching IT managers:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
});

// Get all receptionists
app.get('/api/receptionists', async (res) => {
  try {
    const receptionists = await Receptionist.getAll();
    res.status(200).json({
      success: true,
      count: receptionists.length,
      data: receptionists,
    });
  } catch (error) {
    console.error('Error fetching receptionists:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
});
// Routes
app.get('/', (res) => {
  res.send('Welcome to Quarantine Virtual Doctor API');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
