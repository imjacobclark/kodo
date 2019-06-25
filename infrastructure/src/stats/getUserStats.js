const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const response = (status, body) => {
    return {
        "statusCode": status,
        "headers": {},
        "body": JSON.stringify(body.Item),
        "isBase64Encoded": false
    }
}

const responses = {
    'OK_200': (data, callback) => callback(null, response(200, data)),
    'INTERNAL_SERVER_ERROR_500': (err, callback) => callback(null, response(500, err))
};

exports.handler = (payload, context, callback) => {
    dynamodb.get({
        "TableName": "KodoCalculationTable",
        "Key": {
            "userId": payload.pathParameters.userId
        },
        "ConsistentRead": false,
    }, (err, data) => err ? responses.INTERNAL_SERVER_ERROR_500(err, callback) : responses.OK_200(data, callback));
};