const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = payload => {
    console.log(payload);

    return {
        statusCode: 200
    }
};