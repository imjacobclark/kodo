const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = event => {
    event.Records.forEach(record => {
        let recordToWrite = JSON.parse(new Buffer(record.body, 'base64').toString('ascii')).event;

        dynamodb.update({
            TableName: 'OdoStatTable',
            Key: { userId: recordToWrite.userId },
            UpdateExpression: 'set events = list_append(if_not_exists(events, :empty_list), :value)',
            ExpressionAttributeValues: {
                ':value': recordToWrite.events,
                ':empty_list': []
            }
        }, (err, data) => err ? console.error('ERROR: ' + err) : console.info('OK: ' + JSON.stringify(data, null, '  ')));
    });

    return {
        statusCode: 200
    }
};