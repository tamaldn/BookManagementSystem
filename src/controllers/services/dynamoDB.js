const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, DeleteCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const shortUUID = require('short-uuid');

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
            console.error('Error saving user to DynamoDB');
            throw error;
        }
    }

    async publishBook(bookAttrs) {
        const params = new PutCommand({
            TableName: 'Books',
            Item: {
                book_id: Math.floor(10000 + Math.random() * 90000),
                publication_date: new Date().toDateString(),
                title: bookAttrs.title,
                author: bookAttrs.author,
                genre: bookAttrs.genre,
                description: bookAttrs.description,
                language: bookAttrs.language,
                published_by: bookAttrs.username
            }
        });
        try {
            await this.docClient.send(params);
        } catch (error) {
            console.error('Error while saving book to DynamoDB');
            throw error;
        }
    }

    async searchBooks(title) {
        // Query on GSI: title-index
        const command = new QueryCommand({
            TableName: "Books",
            IndexName: "title-index",
            KeyConditionExpression:
                "title = :title",
            ExpressionAttributeValues: {
                ":title": `${title}`
            }
        });

        try {
            const result = await this.docClient.send(command);
            return result;
        } catch (error) {
            console.error(`Error searching books for '${books}'`);
            throw error;
        }
    }

    async unpublishBook(book_id) {
        const command = new DeleteCommand({
            TableName: "Books",
            Key: { book_id: Number(book_id) },
        });

        try {
            await this.docClient.send(command);
        } catch (error) {
            console.error('Error un-publishing book');
            throw error;
        }
    }

    async getUserBooks(username) {
        // Query on GSI: title-index
        const command = new QueryCommand({
            TableName: "Books",
            IndexName: "published_by-index",
            KeyConditionExpression:
                "published_by = :published_by",
            ExpressionAttributeValues: {
                ":published_by": `${username}`
            }
        });

        try {
            const result = await this.docClient.send(command);
            return result;
        } catch (error) {
            console.error(`Error fetching user books for ${author}`);
            throw error;
        }
    }

    async getAllPublishedBooks(pageSize, lastEvaluatedKey) {
        const params = {
            TableName: "Books",
            Limit: Number(pageSize)
        };

        // Offset for pagination
        if (lastEvaluatedKey) {
            params["ExclusiveStartKey"] = { book_id: Number(lastEvaluatedKey) };
        }

        const command = new ScanCommand(params);

        try {
            const result = await this.docClient.send(command);
            return result;
        } catch (error) {
            console.error(`Error fetching published books`);
            throw error;
        }
    }
}

module.exports = new DbService();