require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const db = require('./config/database.ts');
db.query('SELECT 1 + 1 AS solution', (err, results) => {
  if (err) {
    console.error('Error executing test query:', err);
    return;
  }
  console.log('Database test query result:', results[0].solution);
});


// Routes
app.get('/', (res) => {
  res.send('Welcome to Quarantine Virtual Doctor API');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
