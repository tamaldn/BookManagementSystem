const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dbService = require('../services/dynamoDB');
const secretsManager = require('../services//secretsManager');
const createHttpError = require('http-errors');

class AuthHelper {
    async hashPassword(password) {
        try {
            // Generate a salt
            const salt = await bcrypt.genSalt(10);

            // Hash the password using the generated salt
            const hash = await bcrypt.hash(password, salt);

            // The 'hash' variable now contains the hashed password
            return hash;

            // You can now store the 'hash' securely, for example, in a database
        } catch (error) {
            console.error('Error hashing password:', error);
            throw error;
        }
    }

    async validatePassword(password, hash) {
        return await bcrypt.compare(password, hash);
    }

    async generateToken(username) {
        const SECRET_KEY = await secretsManager.getSecretKey();
        // If signup is successful, generate a JWT token for the new user
        const payload = {
            username,
        };

        try {
            const expiresAt = Date.now() + 3600000;
            const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
            return { token, expiresAt };
        }
        catch (error) {
            console.error(`Error while generating token for user ${username}`);
            throw error;
        }
    }

    async authenticateUser(username, password) {
        const result = await dbService.fetchUser(username);
        if (!result.Item) {
            throw new createHttpError.NotFound("User does not exist");
        }
        const userData = result.Item;
        if (!await this.validatePassword(password, userData.password)) {
            throw new createHttpError.Unauthorized("Incorrect password");
        }
        return true;
    }
}

module.exports = new AuthHelper();