const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = event => {
    const events = {};
    
    event
        .Records
        .forEach(record => record
            .dynamodb
            .NewImage
            .events
            .L
            .forEach(event => console.log(event.M)));

    return {
        statusCode: 200
    }
};