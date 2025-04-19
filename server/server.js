require('dotenv').config();

const express = require('express');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }, // Use secure cookies in production
  })
);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Set up EJS with layouts
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);
app.set('layout', 'layouts/main'); // This specifies the default layout file
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Import routes
const authRoutes = require('./routes/authRoutes');
// ... other route imports
const doctorRoutes = require('./routes/doctorRoutes');
const itManagerRoutes = require('./routes/itManagerRoutes');
// Use routes
app.use('/auth', authRoutes);

app.use('/doctor', doctorRoutes);
// And this line
app.use('/it-manager', itManagerRoutes);
// app.use('/nurse', nurseController);
// ... other route uses

// Import models
const Doctor = require('./models/doctorModel');
const Patient = require('./models/patientModel');
const Nurse = require('./models/nurseModel');
const ITManager = require('./models/itManagerModel');
const Receptionist = require('./models/receptionistModel');

// Import controllers
const nurseController = require('./controllers/nurseController');
const itManagerController = require('./controllers/itManagerController');
const receptionistController = require('./controllers/receptionistController');
const patientController = require('./controllers/patientController');

// Basic API routes for testing
// Get all doctors
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

// Get all patients
app.get('/api/patients', async (res) => {
  try {
    const patients = await Patient.getAll();
    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients,
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
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

// Test routes using controllers
// Nurse controller - Add a new nurse (POST)
app.post('/api/nurses', (req, res) => {
  // Modify the controller method to work with API response
  req.session = {}; // Mock session for testing

  const originalRender = res.render;
  console.log({ originalRender });

  res.render = function (view, options) {
    res.json({ view, options });
  };

  nurseController.addNurse(req, res);
});

// IT Manager controller - Get IT manager dashboard data
app.get('/api/it-manager/home', (req, res) => {
  // Modify the controller method to work with API response
  const originalRender = res.render;
  console.log({ originalRender });

  res.render = function (view, options) {
    res.json({ view, options });
  };

  itManagerController.renderITManagerHome(req, res);
});

// Receptionist controller - Assign room to patient
app.put('/api/patients/:id/room', (req, res) => {
  // Modify the controller method to work with API response
  const originalRender = res.render;
  console.log({ originalRender });

  res.render = function (view, options) {
    res.json({ view, options });
  };

  // Set up the request for the controller
  req.body = {
    patientId: req.params.id,
    roomId: req.body.roomId,
  };

  receptionistController.assignRoom(req, res);
});

// Patient controller - Add health questionnaire to patient
app.post('/api/patients/:id/health-questionnaire', (req, res) => {
  // Modify the controller method to work with API response
  const originalRender = res.render;
  console.log({ originalRender });
  res.render = function (view, options) {
    res.json({ view, options });
  };

  // Set up the request for the controller
  req.body = {
    patientId: req.params.id,
    ...req.body,
  };

  patientController.submitHealthQuestionnaire(req, res);
});

// Routes
app.get('/', (_, res) => {
  res.send('Welcome to Quarantine Virtual Doctor API');
});
// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
