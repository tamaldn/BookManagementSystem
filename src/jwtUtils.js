// src/utils/jwtUtils.js
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = process.env;

class JwtUtils {
  signToken(payload) {
    // Implement logic to sign JWT token
  }

  verifyToken(token) {
    // Implement logic to verify JWT token
  }
}

module.exports = new JwtUtils();
