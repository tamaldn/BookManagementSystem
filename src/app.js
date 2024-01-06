const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const authenticate = require('./middleware/authenticate');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
// For login/signup
app.use('/api/auth', authRoutes);

// Middleware for validating token
app.use('/api/books', async (req, res, next) => { await authenticate.verifyToken(req, res, next) });

// Book APIs
app.use('/api/books', bookRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
