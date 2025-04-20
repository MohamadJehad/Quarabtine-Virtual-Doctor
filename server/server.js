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
const nurseRoutes = require('./routes/nurseRoutes');
const receptionistRoutes = require('./routes/receptionistRoutes');
const patientRoutes = require('./routes/patientRoutes');

// Use routes
app.use('/auth', authRoutes);

app.use('/doctor', doctorRoutes);
// And this line
app.use('/it-manager', itManagerRoutes);
app.use('/nurse', nurseRoutes);
app.use('/receptionist', receptionistRoutes);
app.use('/patient', patientRoutes);
// ... other route uses

// Routes
app.get('/', (_, res) => {
  res.render('welcome');
});
// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
