const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = async (event) => {
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
            Key: {
                id: event.pathParameters.id
            },
            ExpressionAttributeNames: {
                '#item_name': 'name'
            },
            ExpressionAttributeValues: {
                ':name': data.name,
                ':description': data.description,
                ':updatedAt': timestamp
            },
            UpdateExpression: 'SET #item_name = :name, description = :description, updatedAt = :updatedAt',
            ReturnValues: 'ALL_NEW'
        };

        const result = await dynamoDb.update(params).promise();

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(result.Attributes)
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