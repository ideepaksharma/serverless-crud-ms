const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = async (event) => {
    try {
        const timestamp = new Date().getTime();
        const data = JSON.parse(event.body);

        if (!data.name || !data.description) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    message: 'Missing required fields'
                })
            };
        }

        const params = {
            TableName: process.env.DYNAMODB_TABLE,
            Item: {
                id: uuidv4(),
                name: data.name,
                description: data.description,
                createdAt: timestamp,
                updatedAt: timestamp
            }
        };

        await dynamoDb.put(params).promise();

        return {
            statusCode: 201,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(params.Item)
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