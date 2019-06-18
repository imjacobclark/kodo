const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = event => {
    event.Records.forEach(record => {
        let recordToWrite = JSON.parse(new Buffer(record.body, 'base64').toString('ascii')).event;

        console.log(recordToWrite);

        dynamodb.put({
            Item: recordToWrite,
            TableName: "OdoStatTable"
        }, (err, data) => err ? console.error('ERROR: ' + err) : console.info('OK: ' + JSON.stringify(data, null, '  ')));
    });

    return {
        statusCode: 200
    }
};