// src/routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/api/auth/signup', (req, res) => authController.signup(req, res));
router.post('/api/auth/login', (req, res) => authController.generateToken(req, res));

module.exports = router;
