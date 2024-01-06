const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");

class DbService {
    client = new DynamoDBClient({});
    docClient = DynamoDBDocumentClient.from(this.client);

    async fetchUser(username) {
        // Check if the user exists in DynamoDB
        const command = new GetCommand({
            TableName: "Users",
            Key: {
                username
            }
        });

        try {
            return await this.docClient.send(command);
        } catch (error) {
            console.error('Error while fetching users');
            throw error;
        }
    }

    async createUser(username, hashedPassword) {
        const command = new PutCommand({
            TableName: 'Users',
            Item: {
                username,
                password: hashedPassword,
            },
        });

        try {
            await this.docClient.send(command);
        } catch (error) {
            console.error('Error saving user to DynamoDB:', error);
            throw error;
        }
    }
}

module.exports = new DbService();