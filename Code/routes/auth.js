const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

// Define your POST route for login
router.post('/login', authController.login);

// Define your POST route for signup
router.post('/Signup', authController.register);

// Define your POST route for forgot password
router.post('/forgotpass', authController.forgotPassword);

// Define your POST route for userInterface
router.post('/userInterface', authController.userInterface);

// Define your POST route for logout
router.post('/logout', authController.logout);

// Define your POST route for userInterface2
router.post('/userInterface2', authController.userInterface2);

// In your routes setup
router.post('/admin/step1', authController.adminLoginStep1);
router.post('/admin/step2', authController.adminLoginStep2);

module.exports = router;