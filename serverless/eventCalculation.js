const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = event => {
    console.log(event);

    return {
        statusCode: 200
    }
};