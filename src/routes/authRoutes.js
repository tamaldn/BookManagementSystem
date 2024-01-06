// src/routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', async (req, res) => await authController.signup(req, res));
router.post('/login', async (req, res) => await authController.login(req, res));

module.exports = router;
