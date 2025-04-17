const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to Quarantine Virtual Doctor API');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});