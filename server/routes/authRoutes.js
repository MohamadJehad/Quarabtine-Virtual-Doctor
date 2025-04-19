const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// GET login page
router.get('/login', authController.renderLoginPage);

// POST login form
router.post('/login', authController.login);

// GET logout
router.get('/logout', authController.logout);

module.exports = router;
