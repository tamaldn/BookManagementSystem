// src/routes/bookRoutes.js
const express = require('express');
const bookController = require('../controllers/bookController');
const authenticateMiddleware = require('../middleware/authenticate');

const router = express.Router();

router.post('/api/books/publish', authenticateMiddleware.verifyToken, (req, res) => bookController.publishBook(req, res));
router.get('/api/books/search', authenticateMiddleware.verifyToken, (req, res) => bookController.searchBooks(req, res));
router.put('/api/books/unpublish/:bookId', authenticateMiddleware.verifyToken, (req, res) => bookController.unpublishBook(req, res));
router.get('/api/books/user', authenticateMiddleware.verifyToken, (req, res) => bookController.getUserBooks(req, res));
router.get('/api/books/published', authenticateMiddleware.verifyToken, (req, res) => bookController.getAllPublishedBooks(req, res));

module.exports = router;
