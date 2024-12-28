const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.delete = async (event) => {
    try {
        const params = {
            TableName: process.env.DYNAMODB_TABLE,
            Key: {
                id: event.pathParameters.id
            }
        };

        await dynamoDb.delete(params).promise();

        return {
            statusCode: 204,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: ''
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: error.statusCode || 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                message: error.message || 'Internal server error'
            })
        };
    }
};