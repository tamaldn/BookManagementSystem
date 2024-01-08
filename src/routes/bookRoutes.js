// src/routes/bookRoutes.js
const express = require('express');
const bookController = require('../controllers/bookController');
const authenticateMiddleware = require('../middleware/authenticate');

const router = express.Router();

router.post('/publish', (req, res) => bookController.publishBook(req, res));
router.get('/search', (req, res) => bookController.searchBooks(req, res));
router.put('/unpublish/:bookId', (req, res) => bookController.unpublishBook(req, res));
router.get('/user', (req, res) => bookController.getUserBooks(req, res));
router.get('/published', (req, res) => bookController.getAllPublishedBooks(req, res));

module.exports = router;
