const createHttpError = require('http-errors');
const authHelper = require('./helpers/authHelper');
const dbService = require('./services/dynamoDB');
class AuthController {

  async login(req, res) {
    const { username, password } = req.body;

    // Check if username and password are present in the request
    try {
      if (!username || !password) {
        throw createHttpError.BadRequest("Username and password are required");
      }
      (await authHelper.authenticateUser(username, password))
      console.log("User authentication successful");

      // Generate token for the user
      const token = await authHelper.generateToken(username);
      console.log(`Token generated for user ${username}`);
      await res.json(token);
    }
    catch (error) {
      await res.status(error.status || 500).json({ error });
    }
  }

  async signup(req, res) {
    try {
      const { username, password } = req.body;

      // Check if username and password are present in the request
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      // Check if the user already exists in DynamoDB
      const result = await dbService.fetchUser(username);
      if (!!result.Item) {
        throw createHttpError.Conflict(`A user already exists with the username ${username}`);
      }

      // Hash the password (you should use a proper password hashing library)
      const hashedPassword = await authHelper.hashPassword(password);

      // Save the new user to DynamoDB
      await dbService.createUser(username, hashedPassword);

      const token = await authHelper.generateToken(username);

      // Send the token as a response
      await res.json(token);
    } catch (error) {
      await res.status(error.status || 500).json({ error });
    }
  }
}

module.exports = new AuthController();
