
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

class SecretsManager {

    async getSecretKey() {
        let response;
        const secretName = "jwt_secret_key";

        const client = new SecretsManagerClient({
            region: "us-east-1",
        });

        try {
            response = await client.send(
                new GetSecretValueCommand({
                    SecretId: secretName,
                    VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
                })
            );
            return JSON.parse(response.SecretString).jwt_private_key;
        } catch (error) {
            // For a list of exceptions thrown, see
            // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
            // return res.status(500).json({ error: 'Failed to signup. Please try again.' });
            console.error(`Error while fetching secret key`);
            throw error;
        }
    }
}

module.exports = new SecretsManager();