// src/controllers/authController.js
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { SECRET_KEY } = process.env;

class AuthController {
  authenticateUser(username, password) {
    // Implement your authentication logic here
    // For simplicity, let's assume a hardcoded username and password
    const validUsername = 'user123';
    const validPassword = 'password123';

    return username === validUsername && password === validPassword;
  }

  generateToken(req, res) {
    const { username, password } = req.body;

    // Check if username and password are present in the request
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Authenticate the user
    if (this.authenticateUser(username, password)) {
      // Create a payload with user information
      const payload = {
        username,
      };

      // Generate a JWT token
      const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

      // Send the token as a response
      res.json({ token });
    } else {
      // If authentication fails, send an error response
      res.status(401).json({ error: 'Invalid username or password' });
    }
  }

  signupUser(username, password) {
    // Implement your user signup logic here
    // For simplicity, let's assume a successful signup
    // You should replace this with your actual signup logic (e.g., storing user in a database)
    return true;
  }

  signup(req, res) {
    const { username, password } = req.body;

    // Check if username and password are present in the request
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Attempt to signup the user
    if (this.signupUser(username, password)) {
      // If signup is successful, generate a JWT token for the new user
      const payload = {
        username,
      };

      const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

      // Send the token as a response
      res.json({ token });
    } else {
      // If signup fails, send an error response
      res.status(400).json({ error: 'Failed to signup. Please try again.' });
    }
  }
}

module.exports = new AuthController();
