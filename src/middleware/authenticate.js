// src/middleware/authenticate.js
const jwt = require('jsonwebtoken');
const secretsManager = require('../controllers/services/secretsManager');
const createHttpError = require('http-errors');

class AuthenticateMiddleware {
  async verifyToken(req, res, next) {
    try {
      const token = req.header("Authorization");
      if (!token) {
        throw new createHttpError.Unauthorized("No token provided");
      }
      const SECRET_KEY = await secretsManager.getSecretKey();
      try {
        // Verify the token
        const decodedToken = jwt.verify(token, SECRET_KEY);
        // Attach user information to the request for further processing
        req.user = decodedToken;
        next();
      } catch (error) {
        throw new createHttpError.Unauthorized(
          error instanceof jwt.TokenExpiredError ?
            "Token expired" :
            "Invalid token");
      }
    }
    catch (error) {
      console.log("Error while validating token");
      await res.status(error.status || 500).json({ error });
    }
    // Implement middleware for verifying JWT tokens and extracting user information
  }
}

module.exports = new AuthenticateMiddleware();
